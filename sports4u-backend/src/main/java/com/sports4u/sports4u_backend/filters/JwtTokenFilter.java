package com.sports4u.sports4u_backend.filters;

import com.sports4u.sports4u_backend.entity.UserEntity;
import com.sports4u.sports4u_backend.utils.JwtTokenUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;


    //v1 check token de xac thuc
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try{
            if(isBypassToken(request)) { // khong can ktra token nua ma van co the tiep tuc di ra web config
                filterChain.doFilter(request, response); //enable bypass
                return;
            }
            final String authHeader = request.getHeader("Authorization");
            if(authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                return;
            }

            final String token = authHeader.substring(7);
            final String userName = jwtTokenUtil.extractUsername(token);
            // lay securityContext => lay doi tuong authentication luu thong tin nguoi dung trong context
            if(userName != null && SecurityContextHolder.getContext().getAuthentication() == null) { // Người dùng chưa được xác thực => cần kiểm tra token
                UserEntity user = (UserEntity) userDetailsService.loadUserByUsername(userName);
                if(jwtTokenUtil.validateToken(token, user)) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()); //user chua userName, password, listRole
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request)); // gan them thong tin phu ve request vao doi tuong nhu session id, ip
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
//                    System.out.println("Authentication after set: " +
//                            SecurityContextHolder.getContext().getAuthentication());
//                    SecurityContextHolder.getContext().getAuthentication().getAuthorities()
//                            .forEach(auth -> System.out.println("Authority: " + auth.getAuthority()));
                }
            }
            filterChain.doFilter(request, response); // di tiep sang filter chua requestMatcher
        }catch (Exception ex){
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED,"Unauthorized");
        }
    }

    private boolean isBypassToken(HttpServletRequest request) {
        if (request.getServletPath().contains("/payment/vnpay-return")) {
            return true;
        }

        final List<Pair<String, String>> bypassTokens = Arrays.asList(
                Pair.of("/api/user/register", "POST"),
                Pair.of("/api/user/login", "POST"),
                Pair.of("/api/user/forgot-password", "POST"),
                Pair.of("/api/user/verify-otp", "POST"),
                Pair.of("/api/user/reset-password", "POST"),
                Pair.of("/api/user/resend-otp", "POST"),
                Pair.of("/api/user/refresh-token", "POST"),
                Pair.of("/api/user/logout", "POST"),
                Pair.of("/api/categories/**", "GET"),
                Pair.of("/api/products/**", "GET")
        );

        for (Pair<String, String> bypassToken : bypassTokens) {
            if (pathMatcher.match(bypassToken.getFirst(), request.getServletPath())
                    && request.getMethod().equals(bypassToken.getSecond())) {
                return true;
            }
        }
        return false;
    }
}
