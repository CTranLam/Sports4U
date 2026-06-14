--
-- PostgreSQL database dump
--

\restrict eQHkR4phO2EogawSlTrhQoJkkEypwTnyHA98YPQFKIQztofwRrudqow5pouUUyO

-- Dumped from database version 15.17
-- Dumped by pg_dump version 15.17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: otp_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.otp_status AS ENUM (
    'PENDING',
    'SENT',
    'FAILED',
    'VERIFIED'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    cart_item_id bigint NOT NULL,
    user_id bigint,
    product_id bigint,
    quantity bigint NOT NULL,
    price_at_added numeric(12,2) NOT NULL,
    selected boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: cart_items_cart_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cart_items_cart_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cart_items_cart_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cart_items_cart_item_id_seq OWNED BY public.cart_items.cart_item_id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    category_id bigint NOT NULL,
    name character varying(100) NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    parent_id bigint,
    description text
);


--
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- Name: order_details; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_details (
    order_detail_id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer,
    unit_price numeric(15,2),
    subtotal numeric(15,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: order_details_order_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_details_order_detail_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_details_order_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_details_order_detail_id_seq OWNED BY public.order_details.order_detail_id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    order_id bigint NOT NULL,
    user_id bigint,
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total_amount numeric(15,2),
    status character varying(20) DEFAULT 'Pending'::character varying,
    payment_method text,
    payment_status text,
    province_code character varying(20) NOT NULL,
    ward_code character varying(20) NOT NULL,
    address_detail text NOT NULL,
    full_address text NOT NULL
);


--
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- Name: password_reset_otp; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_otp (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    otp_code character varying(10) NOT NULL,
    expiration_time timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20)
);


--
-- Name: password_reset_otp_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.password_reset_otp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: password_reset_otp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.password_reset_otp_id_seq OWNED BY public.password_reset_otp.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    product_id bigint NOT NULL,
    category_id bigint,
    name character varying(200) NOT NULL,
    description text,
    origin character varying(100),
    advantages text,
    price numeric(15,2) NOT NULL,
    stock_quantity bigint NOT NULL,
    image_url character varying(255),
    is_deleted boolean DEFAULT false NOT NULL,
    is_popular boolean DEFAULT false NOT NULL
);


--
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;


--
-- Name: provinces; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.provinces (
    code character varying(20) NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    review_id bigint NOT NULL,
    product_id bigint NOT NULL,
    user_id bigint NOT NULL,
    rating integer NOT NULL,
    comment character varying(1000),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id bigint NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    full_name character varying(100),
    phone character varying(20),
    role character varying(20) DEFAULT 'User'::character varying,
    status bigint DEFAULT 1,
    province_code character varying(20),
    ward_code character varying(20),
    detail_address character varying(255)
);


--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: wards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wards (
    code character varying(20) NOT NULL,
    name character varying(255) NOT NULL,
    province_code character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: cart_items cart_item_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN cart_item_id SET DEFAULT nextval('public.cart_items_cart_item_id_seq'::regclass);


--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: order_details order_detail_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_details ALTER COLUMN order_detail_id SET DEFAULT nextval('public.order_details_order_detail_id_seq'::regclass);


--
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- Name: password_reset_otp id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_otp ALTER COLUMN id SET DEFAULT nextval('public.password_reset_otp_id_seq'::regclass);


--
-- Name: products product_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_items (cart_item_id, user_id, product_id, quantity, price_at_added, selected, created_at, updated_at) FROM stdin;
8	4	8	2	250000.00	t	2026-02-20 10:19:24.932768	2026-02-20 10:19:24.932768
17	6	12	6	520000.00	t	2026-02-28 11:23:34.26687	2026-02-28 11:23:34.26687
18	6	4	5	120000.00	t	2026-02-28 11:23:59.583653	2026-02-28 11:23:59.583653
19	6	15	3	860000.00	t	2026-03-04 22:08:56.570364	2026-03-04 22:08:56.570364
20	18	15	1	860000.00	f	2026-06-13 00:36:19.575107	2026-06-13 00:36:19.575146
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (category_id, name, is_deleted, parent_id, description) FROM stdin;
1	Pickleball	f	6	\N
2	Badminton	f	6	\N
4	Tenis	f	6	\N
5	Bóng rổ	t	6	\N
11	Whey	f	8	\N
8	Thực phẩm bổ sung	f	\N	\N
6	Thể thao	f	\N	\N
7	Trang trí	f	\N	\N
10	Sticker	f	7	\N
\.


--
-- Data for Name: order_details; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_details (order_detail_id, order_id, product_id, quantity, unit_price, subtotal, created_at) FROM stdin;
3	6	4	20	120000.00	2400000.00	2026-02-19 23:57:20.50357
4	6	6	12	200000.00	2400000.00	2026-02-19 23:57:23.086871
5	6	8	18	250000.00	4500000.00	2026-02-19 23:57:25.624316
6	7	8	18	250000.00	4500000.00	2026-02-20 00:05:41.663115
7	8	6	18	200000.00	3600000.00	2026-02-20 08:57:45.656366
8	8	8	2	250000.00	500000.00	2026-02-20 08:57:47.16155
9	9	4	2	120000.00	240000.00	2026-02-20 15:53:20.17482
10	10	6	4	200000.00	800000.00	2026-02-20 15:55:34.879167
11	11	4	2	120000.00	240000.00	2026-02-25 21:23:30.563779
12	12	9	1	150000.00	150000.00	2026-02-28 00:57:01.543583
13	13	12	3	520000.00	1560000.00	2026-02-28 01:03:54.168516
14	14	11	2	220000.00	440000.00	2026-02-28 01:06:53.455906
15	15	9	3	150000.00	450000.00	2026-02-28 01:07:01.039248
16	16	8	2	250000.00	500000.00	2026-02-28 01:08:24.768363
17	17	8	2	250000.00	500000.00	2026-02-28 01:10:17.596051
18	18	8	2	250000.00	500000.00	2026-02-28 01:15:44.540675
19	19	8	3	250000.00	750000.00	2026-02-28 01:15:55.344443
20	20	11	2	220000.00	440000.00	2026-02-28 01:16:11.393289
21	21	6	1	200000.00	200000.00	2026-02-28 01:23:01.325533
22	22	11	4	220000.00	880000.00	2026-02-28 11:08:35.636196
23	23	4	2	120000.00	240000.00	2026-02-28 11:13:37.498851
24	24	4	2	120000.00	240000.00	2026-02-28 11:16:22.176645
25	25	4	3	120000.00	360000.00	2026-02-28 11:19:36.483472
26	26	8	5	250000.00	1250000.00	2026-02-28 11:22:07.19283
27	26	4	5	120000.00	600000.00	2026-02-28 11:22:08.722184
28	26	9	8	150000.00	1200000.00	2026-02-28 11:22:09.992519
29	27	29	2	2900000.00	5800000.00	2026-03-25 09:47:03.044097
30	28	15	1	860000.00	860000.00	2026-06-13 16:18:23.234138
31	29	8	1	250000.00	250000.00	2026-06-13 16:19:22.129748
32	30	21	1	650000.00	650000.00	2026-06-13 16:19:34.435031
33	31	8	1	250000.00	250000.00	2026-06-13 16:25:35.476336
34	32	8	1	250000.00	250000.00	2026-06-13 16:26:49.174235
35	33	8	1	250000.00	250000.00	2026-06-13 16:43:34.438911
36	34	8	1	250000.00	250000.00	2026-06-13 16:47:30.454389
37	35	21	1	650000.00	650000.00	2026-06-13 16:52:21.010851
38	36	15	1	860000.00	860000.00	2026-06-13 16:52:59.005399
39	37	15	1	860000.00	860000.00	2026-06-13 23:00:52.148892
40	38	25	1	2000000.00	2000000.00	2026-06-13 23:05:46.807623
41	39	24	1	900000.00	900000.00	2026-06-13 23:06:13.780943
42	40	6	1	200000.00	200000.00	2026-06-13 23:08:18.136359
43	41	29	1	100000.00	100000.00	2026-06-13 17:22:04.607401
44	42	4	1	100000.00	100000.00	2026-06-13 17:22:09.922461
45	42	12	1	100000.00	100000.00	2026-06-13 17:22:09.922461
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (order_id, user_id, order_date, total_amount, status, payment_method, payment_status, province_code, ward_code, address_detail, full_address) FROM stdin;
14	6	2026-02-28 01:06:53.450264	440000.00	PENDING	COD	UNPAID	29	29001	Số 5 Đinh Tiên Hoàng	Số 5 Đinh Tiên Hoàng, Phường Hoàn Kiếm, Hà Nội
26	6	2026-02-28 11:22:06.41834	3050000.00	CONFIRMED	VNPAY	PAID	29	29001	Số 5 Đinh Tiên Hoàng	Số 5 Đinh Tiên Hoàng, Phường Hoàn Kiếm, Hà Nội
16	6	2026-02-28 01:08:24.728364	500000.00	CONFIRMED	VNPAY	PAID	29	29001	Số 5 Đinh Tiên Hoàng	Số 5 Đinh Tiên Hoàng, Phường Hoàn Kiếm, Hà Nội
18	6	2026-02-28 01:15:44.531553	500000.00	CANCELLED	VNPAY	UNPAID	29	29001	Số 5 Đinh Tiên Hoàng	Số 5 Đinh Tiên Hoàng, Phường Hoàn Kiếm, Hà Nội
17	6	2026-02-28 01:10:17.585005	500000.00	CONFIRMED	VNPAY	PAID	29	29001	Số 5 Đinh Tiên Hoàng	Số 5 Đinh Tiên Hoàng, Phường Hoàn Kiếm, Hà Nội
19	6	2026-02-28 01:15:55.335775	750000.00	PENDING	COD	UNPAID	29	29001	Số 5 Đinh Tiên Hoàng	Số 5 Đinh Tiên Hoàng, Phường Hoàn Kiếm, Hà Nội
10	4	2026-02-20 15:55:34.86762	800000.00	CANCELLED	COD	UNPAID	98	98001	Số 8B đường Hố Cát	Số 8B đường Hố Cát, Phường Hoàng Văn Thụ, Bắc Giang
9	4	2026-02-20 15:53:20.137519	240000.00	COMPLETED	VNPAY	PAID	98	98001	Số 8B đường Hố Cát	Số 8B đường Hố Cát, Phường Hoàng Văn Thụ, Bắc Giang
20	6	2026-02-28 01:16:11.383591	440000.00	CONFIRMED	VNPAY	PAID	29	29001	Số 5 Đinh Tiên Hoàng	Số 5 Đinh Tiên Hoàng, Phường Hoàn Kiếm, Hà Nội
15	6	2026-02-28 01:07:01.028292	450000.00	COMPLETED	VNPAY	PAID	29	29001	Số 5 Đinh Tiên Hoàng	Số 5 Đinh Tiên Hoàng, Phường Hoàn Kiếm, Hà Nội
8	4	2026-02-20 08:57:44.511321	4100000.00	CONFIRMED	VNPAY	PAID\n	98	98001	Số 8B đường Hố Cát	Số 8B đường Hố Cát, Phường Hoàng Văn Thụ, Bắc Giang
7	4	2026-02-20 00:05:39.085519	4500000.00	CONFIRMED	COD	PAID	98	98001	Số 8B đường Hố Cát	Số 8B đường Hố Cát, Phường Hoàng Văn Thụ, Bắc Giang
11	8	2026-02-25 21:23:30.535518	240000.00	PENDING	VNPAY	UNPAID	98	98002	Số 8A đường Hố Cát	Số 8A đường Hố Cát, Phường Lê Lợi, Bắc Ninh
12	6	2026-02-28 00:57:01.464605	150000.00	CONFIRMED	VNPAY	PAID	29	29001	Số 5 Đinh Tiên Hoàng	Số 5 Đinh Tiên Hoàng, Phường Hoàn Kiếm, Hà Nội
22	6	2026-02-28 11:08:35.209259	880000.00	COMPLETED	VNPAY	PAID	29	29001	Số 5 Đinh Tiên Hoàng	Số 5 Đinh Tiên Hoàng, Phường Hoàn Kiếm, Hà Nội
21	6	2026-02-28 01:23:01.258246	200000.00	SHIPPING	VNPAY	PAID	29	29001	Số 5 Đinh Tiên Hoàng	Số 5 Đinh Tiên Hoàng, Phường Hoàn Kiếm, Hà Nội
24	6	2026-02-28 11:16:22.166291	240000.00	CONFIRMED	VNPAY	PAID	29	29001	Số 5 Đinh Tiên Hoàng	Số 5 Đinh Tiên Hoàng, Phường Hoàn Kiếm, Hà Nội
25	6	2026-02-28 11:19:36.473207	360000.00	PENDING	VNPAY	UNPAID	29	29001	Số 5 Đinh Tiên Hoàng	Số 5 Đinh Tiên Hoàng, Phường Hoàn Kiếm, Hà Nội
13	6	2026-02-28 01:03:54.160483	1560000.00	COMPLETED	VNPAY	PAID	29	29001	Số 5 Đinh Tiên Hoàng	Số 5 Đinh Tiên Hoàng, Phường Hoàn Kiếm, Hà Nội
6	4	2026-02-19 23:57:19.479468	9300000.00	COMPLETED	COD	PAID	98	98001	Số 8B đường Hố Cát	Số 8B đường Hố Cát, Phường Hoàng Văn Thụ, Bắc Giang
23	6	2026-02-28 11:13:37.307918	240000.00	COMPLETED	VNPAY	PAID	29	29001	Số 5 Đinh Tiên Hoàng	Số 5 Đinh Tiên Hoàng, Phường Hoàn Kiếm, Hà Nội
27	6	2026-03-25 09:47:03.027586	5800000.00	COMPLETED	VNPAY	PAID	29	29001	Số 5 Đinh Tiên Hoàng	Số 5 Đinh Tiên Hoàng, Phường Hoàn Kiếm, Hà Nội
28	18	2026-06-13 16:18:23.197183	860000.00	PENDING	VNPAY	UNPAID	29	29002	số 8 Đường Ba Đình	số 8 Đường Ba Đình, Phường Ba Đình, Hà Nội
29	18	2026-06-13 16:19:22.115397	250000.00	PENDING	COD	UNPAID	29	29002	số 8 Đường Ba Đình	số 8 Đường Ba Đình, Phường Ba Đình, Hà Nội
30	18	2026-06-13 16:19:34.418792	650000.00	PENDING	VNPAY	UNPAID	29	29002	số 8 Đường Ba Đình	số 8 Đường Ba Đình, Phường Ba Đình, Hà Nội
31	18	2026-06-13 16:25:35.461138	250000.00	PENDING	VNPAY	UNPAID	29	29002	số 8 Đường Ba Đình	số 8 Đường Ba Đình, Phường Ba Đình, Hà Nội
32	18	2026-06-13 16:26:49.116703	250000.00	PENDING	VNPAY	UNPAID	29	29002	số 8 Đường Ba Đình	số 8 Đường Ba Đình, Phường Ba Đình, Hà Nội
33	18	2026-06-13 16:43:34.395981	250000.00	PENDING	VNPAY	UNPAID	29	29002	số 8 Đường Ba Đình	số 8 Đường Ba Đình, Phường Ba Đình, Hà Nội
34	18	2026-06-13 16:47:30.386081	250000.00	PENDING	VNPAY	UNPAID	29	29002	số 8 Đường Ba Đình	số 8 Đường Ba Đình, Phường Ba Đình, Hà Nội
35	18	2026-06-13 16:52:20.96301	650000.00	PENDING	VNPAY	UNPAID	29	29002	số 8 Đường Ba Đình	số 8 Đường Ba Đình, Phường Ba Đình, Hà Nội
37	18	2026-06-13 23:00:52.096172	860000.00	PENDING	VNPAY	UNPAID	29	29002	số 8 Đường Ba Đình	số 8 Đường Ba Đình, Phường Ba Đình, Hà Nội
38	18	2026-06-13 23:05:46.795886	2000000.00	PENDING	COD	UNPAID	29	29002	số 8 Đường Ba Đình	số 8 Đường Ba Đình, Phường Ba Đình, Hà Nội
39	18	2026-06-13 23:06:13.771948	900000.00	PENDING	COD	UNPAID	29	29002	số 8 Đường Ba Đình	số 8 Đường Ba Đình, Phường Ba Đình, Hà Nội
40	18	2026-06-13 23:08:18.122473	200000.00	PENDING	COD	UNPAID	29	29002	số 8 Đường Ba Đình	số 8 Đường Ba Đình, Phường Ba Đình, Hà Nội
36	18	2026-06-13 16:52:58.958498	860000.00	CANCELLED	VNPAY	FAILED	29	29002	số 8 Đường Ba Đình	số 8 Đường Ba Đình, Phường Ba Đình, Hà Nội
41	18	2026-06-13 17:22:04.607401	100000.00	COMPLETED	COD	PAID	29	29001	Test Address	Test Address
42	18	2026-06-13 17:22:09.922461	200000.00	COMPLETED	COD	PAID	29	29001	Test Address	Test Address
\.


--
-- Data for Name: password_reset_otp; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.password_reset_otp (id, user_id, otp_code, expiration_time, created_at, status) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (product_id, category_id, name, description, origin, advantages, price, stock_quantity, image_url, is_deleted, is_popular) FROM stdin;
19	10	Nhãn bóng đá	\N	Việt Nam	rẻ	100000.00	20	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1772679967/sports4u/products/vgfjhxmjuyoru11wwbh8.jpg	t	f
12	4	ELITE PADDLE	\N	Viet Nam	Sang trọng, hiện đại	520000.00	57	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1772031698/sports4u/products/rlvlixy7zl9bekshvmrr.png	f	f
22	2	Boika 9650	\N	Việt Nam	Bền bỉ và đẳng cấp	500000.00	15	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1774404574/sports4u/products/wyfnqjjcpdwnveby1evd.jpg	f	f
23	2	Lining YL	\N	Việt Nam	Bền bỉ và đẳng cấp	800000.00	20	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1774404731/sports4u/products/pwbxzm9y3eide79lttb6.jpg	f	f
20	4	RaptorMMA	\N	Việt Nam	Bền bỉ và đẳng cấp	1200000.00	10	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1772680031/sports4u/products/gm10ko9kwm0lu38olmrv.png	t	f
11	2	ACEPRO ELITE PADDLE	\N	Viet Nam	Sang trọng, hiện đại	220000.00	17	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1772031345/sports4u/products/bctxaupkr9dk3a2evyfl.jpg	f	f
26	4	Head Speed	\N	Việt Nam	Bền bỉ và đẳng cấp	2000000.00	10	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1774405372/sports4u/products/dhewds7n8vqle8yipwzq.jpg	t	f
27	4	Terniribec	\N	Việt Nam	Bền bỉ và đẳng cấp	3000000.00	20	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1774405452/sports4u/products/mj3z36t6chwpensozfr6.jpg	f	f
4	1	ACEPRO ELITE PADDLE	\N	Viet Nam	Sang trọng, hiện đại	120000.00	164	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1771081326/sports4u/products/dmwkc4jhm0mv7pujas3f.jpg	f	f
9	1	RAPTOR SERIES	\N	Việt Nam	Nhẹ, bền	150000.00	158	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1771077129/sports4u/products/dyu7ybvphtt37rfzaaaz.jpg	f	f
18	10	Cartoon Sticker	\N	Việt Nam	rẻ	100000.00	20	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1774405935/sports4u/products/t61hh7ulkbd6zbmvsrsq.png	f	f
30	10	Nhãn dán hổ	\N	Việt Nam	Rẻ	20000.00	100	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1774405996/sports4u/products/ffp3isnptyxqbrnkcrhg.png	f	f
14	1	aa	\N	vn	rẻ	111.00	11	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1772296541/sports4u/products/limvxyajgxrli1gsqoaq.jpg	t	f
13	1	ELITE PADDLE	\N	Viet Nam	Sang trọng, hiện đại	520000.00	60	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1772296404/sports4u/products/g1ucypmhcamnqcw6chui.png	t	f
16	5	aa	\N	Việt Nam	rẻ	111.00	111	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1772297629/sports4u/products/g0t1queae6uxmiy7qtrr.jpg	t	f
17	11	Whey Pro	\N	Phần Lan	Tốt	1000000.00	10	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1772641037/sports4u/products/lob4rlyketkpwgjrkvnv.png	f	f
33	11	Shred Whey	\N	Việt Nam	Bền bỉ và đẳng cấp	1000000.00	50	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1774406208/sports4u/products/s8hqwy6nwvxqucbetxcd.png	f	f
34	11	Whey Isolate	\N	Việt Nam	Bền bỉ và đẳng cấp	900000.00	30	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1774406259/sports4u/products/lpxggsc2flys9jlz4qc4.jpg	f	f
35	11	Biox Whey	\N	Việt Nam	Bền bỉ và đẳng cấp	980000.00	35	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1774406419/sports4u/products/kugxndarungytlo6hqpo.jpg	f	f
29	4	Wilson Six One	\N	Việt Nam	Bền bỉ và đẳng cấp	2900000.00	28	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1774405652/sports4u/products/optgf45uren4u6t8vvmg.jpg	f	f
36	11	Whey Oats	\N	Việt Nam	Bền bỉ và đẳng cấp	800000.00	25	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1774406741/sports4u/products/ytxye90vn1bbeybdkutq.jpg	f	t
32	10	Logo bóng đá	\N	Việt Nam	Bền bỉ và đẳng cấp	30000.00	150	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1774406110/sports4u/products/vgie5bevikcozdag1r2z.jpg	f	t
31	10	Bộ nhãn dán Việt Nam	\N	Việt Nam	Bền bỉ và đẳng cấp	25000.00	200	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1774406056/sports4u/products/xvd4lvzepmv8pqtbnjzx.jpg	f	t
6	1	VELOCITY CARBON	\N	Việt Nam	Nhẹ, bền	200000.00	100	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1771074107/sports4u/products/qe4njtwnuvh6bf2grztr.jpg	f	t
15	1	THECHAMP	\N	Việt Nam	Bền bỉ và đẳng cấp	860000.00	47	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1772296724/sports4u/products/mymdcnl7drb8a2vxbgja.png	f	t
25	4	Head Speed	\N	Việt Nam	Bền bỉ và đẳng cấp	2000000.00	9	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1774405370/sports4u/products/gejgfbvovfsbomk5koua.jpg	f	f
24	2	Mizuno Carbosonic	\N	Việt Nam	Bền bỉ và đẳng cấp	900000.00	21	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1774404794/sports4u/products/u8a4cjal2o9pbhhu96ik.jpg	f	t
8	1	TITAN PRO	\N	Việt Nam	Nhẹ, bền	250000.00	61	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1771077078/sports4u/products/xspkdukfzrknqxad09mq.jpg	f	t
21	2	Yonex Astrox	\N	Việt Nam	Bền bỉ và đẳng cấp	650000.00	8	https://res.cloudinary.com/dfnsu6tf4/image/upload/v1774404511/sports4u/products/m6qifp5k1crlyddxa5el.jpg	f	t
\.


--
-- Data for Name: provinces; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.provinces (code, name, created_at) FROM stdin;
29	Hà Nội	2026-02-12 20:16:21.794048
24	Thái Nguyên	2026-02-12 20:16:21.794048
35	Ninh Bình	2026-02-12 20:16:21.794048
18	Nam Định	2026-02-12 20:16:21.794048
51	Thành phố Hồ Chí Minh	2026-02-25 20:11:01.388086
15	Hải Phòng	2026-02-25 20:12:15.728579
43	Đà Nẵng	2026-02-25 20:12:15.728579
75	Huế	2026-02-25 20:12:15.728579
65	Cần Thơ	2026-02-25 20:12:46.484865
11	Cao Bằng	2026-02-25 20:12:46.484865
12	Lạng Sơn	2026-02-25 20:14:13.695627
25	Lai Châu	2026-02-25 20:14:13.695627
27	Điện Biên	2026-02-25 20:14:13.695627
26	Sơn La	2026-02-25 20:14:13.695627
22	Tuyên Quang	2026-02-25 20:14:13.695627
21	Lào Cai	2026-02-25 20:14:13.695627
19	Phú Thọ	2026-02-25 20:15:07.062682
89	Hưng Yên	2026-02-25 20:15:07.062682
14	Quảng Ninh	2026-02-25 20:24:21.658381
36	Thanh Hóa	2026-02-25 20:24:21.658381
37	Nghệ An	2026-02-25 20:24:21.658381
38	Hà Tĩnh	2026-02-25 20:24:21.658381
73	Quảng Trị	2026-02-25 20:24:21.658381
76	Quảng Ngãi	2026-02-25 20:24:21.658381
79	Khánh Hòa	2026-02-25 20:26:38.025631
47	Đắk Lắk	2026-02-25 20:26:38.025631
39	Đồng Nai	2026-02-25 20:26:38.025631
62 	Tây Ninh	2026-02-25 20:26:38.025631
64	Vĩnh Long	2026-02-25 20:26:38.025631
63	Đồng Tháp	2026-02-25 20:26:38.025631
69	Cà Mau	2026-02-25 20:26:38.025631
67	An Giang	2026-02-25 20:26:38.025631
98	Bắc Ninh	2026-02-12 20:16:21.794048
48	Lâm Đồng	2026-02-25 20:14:13.695627
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reviews (review_id, product_id, user_id, rating, comment, created_at) FROM stdin;
1	29	18	5	Sản phẩm rất tốt\n	2026-06-14 01:15:44.681402
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (user_id, email, password, full_name, phone, role, status, province_code, ward_code, detail_address) FROM stdin;
10	user3@gmail.com	$2a$10$o01L/fPG0hISSgOQAyIMcey6RHOS5bhf1uUZkt1Tl/BFB4P.AJuOm	\N	\N	ROLE_USER	1	\N	\N	\N
8	lam660437@gmail.com	$2a$10$yCTzlC2tzukzp34KWrW2UuUOdUqzFW1hj7NwvE/77CuYxYTch/Pky	Trần Quang Lâm	0328333175	ROLE_USER	1	98	98002	Số 8A đường Hố Cát
5	tlam15282@gmail.com	$2a$10$9Znm5QnMok6dZWz4XlE4COG3nNC3sesucIkYbmCBXE4u3d5coRs/K	\N	\N	ROLE_ADMIN	1	\N	\N	\N
15	admin2@gmail.com	$2a$10$co1VaLOtghHAf.KFIJ/dmOAryli/bqMANI7L9D8KrL3g2ogfMynlm	\N	\N	ROLE_ADMIN	1	\N	\N	\N
9	admin1@gmail.com	$2a$10$B5Sp/R3WW1D8.yJLfaR4rePqJyM7NP8k7VrUnY/B2acxGvAUswXyq	\N	\N	ROLE_ADMIN	1	\N	\N	\N
7	user2@gmail.com	$2a$10$jhGBBDpevGG/i5y5s6IPoeLdPeitVbLytP1t7B/.mHDahmFRnCzJG	\N	\N	ROLE_USER	1	\N	\N	\N
17	user5@gmail.com	$2a$10$nPBAdBXNUc.t1TntGyx00.kLSA4c8QmhXi/10RDTvWZni/P/mBOAa	\N	\N	ROLE_USER	1	\N	\N	\N
18	user10@gmail.com	$2a$10$WXGr7luKUO65L5wfMhMYIefdxFtmukOM18rptDuPua0j5HOk0Xq8.	Trần Quang Lâm	0123456789	ROLE_USER	1	29	29002	số 8 Đường Ba Đình
19	testuser123@gmail.com	$2a$10$YRLLiwZQm1M8HDIC3Bdwje6R56l7RFJxqFs8AZqTXX6tz8teYaUaa	\N	\N	ROLE_USER	1	\N	\N	\N
6	user1@gmail.com	a0/ZuPTlpjrwrjMtYpgQtMfHZ9/PAGPZ4xsC	Trần Quang Lâm	0328333175	ROLE_USER	1	29	29001	Số 5 Đinh Tiên Hoàng
4	test@gmail.com	a0/ZuPTlpjrwrjMtYpgQtMfHZ9/PAGPZ4xsC	Trần Quang Lâm	0328333175	ROLE_USER	0	98	98001	Số 8B đường Lê Lợi
14	user4@gmail.com	$2a$10$OXZAGdAMNWTJuhpw/oATm.tZDx2I9dhCLljpbNI6.B6BrgjfJrn1C	\N	\N	ROLE_USER	0	\N	\N	\N
\.


--
-- Data for Name: wards; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.wards (code, name, province_code, created_at) FROM stdin;
18001	Phường Vị Hoàng	18	2026-02-12 20:17:53.16343
18002	Phường Trần Hưng Đạo	18	2026-02-12 20:17:53.16343
18003	Phường Lộc Vượng	18	2026-02-12 20:17:53.16343
18004	Phường Quang Trung	18	2026-02-12 20:17:53.16343
18005	Phường Cửa Bắc	18	2026-02-12 20:17:53.16343
24001	Phường Hoàng Văn Thụ	24	2026-02-12 20:17:53.16343
24002	Phường Quang Trung	24	2026-02-12 20:17:53.16343
24003	Phường Tân Lập	24	2026-02-12 20:17:53.16343
24004	Phường Phan Đình Phùng	24	2026-02-12 20:17:53.16343
24005	Phường Gia Sàng	24	2026-02-12 20:17:53.16343
29001	Phường Hoàn Kiếm	29	2026-02-12 20:17:53.16343
29002	Phường Ba Đình	29	2026-02-12 20:17:53.16343
29003	Phường Đống Đa	29	2026-02-12 20:17:53.16343
29004	Phường Hai Bà Trưng	29	2026-02-12 20:17:53.16343
29005	Phường Cầu Giấy	29	2026-02-12 20:17:53.16343
35001	Phường Đông Thành	35	2026-02-12 20:17:53.16343
35002	Phường Nam Bình	35	2026-02-12 20:17:53.16343
35003	Phường Tân Thành	35	2026-02-12 20:17:53.16343
35004	Phường Thanh Bình	35	2026-02-12 20:17:53.16343
35005	Phường Ninh Khánh	35	2026-02-12 20:17:53.16343
98001	Phường Hoàng Văn Thụ	98	2026-02-12 20:17:53.16343
98002	Phường Lê Lợi	98	2026-02-12 20:17:53.16343
98003	Phường Ngô Quyền	98	2026-02-12 20:17:53.16343
98004	Phường Trần Phú	98	2026-02-12 20:17:53.16343
98005	Phường Dĩnh Kế	98	2026-02-12 20:17:53.16343
\.


--
-- Name: cart_items_cart_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_items_cart_item_id_seq', 21, true);


--
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 11, true);


--
-- Name: order_details_order_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_details_order_detail_id_seq', 45, true);


--
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 42, true);


--
-- Name: password_reset_otp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.password_reset_otp_id_seq', 78, true);


--
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_product_id_seq', 36, true);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 1, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_user_id_seq', 19, true);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (cart_item_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: order_details order_details_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_pkey PRIMARY KEY (order_detail_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: password_reset_otp password_reset_otp_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_otp
    ADD CONSTRAINT password_reset_otp_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (code);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: wards wards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wards
    ADD CONSTRAINT wards_pkey PRIMARY KEY (code);


--
-- Name: idx_reviews_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_product_id ON public.reviews USING btree (product_id);


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- Name: cart_items cart_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(category_id);


--
-- Name: products fk_category; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES public.categories(category_id);


--
-- Name: categories fk_category_parent; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES public.categories(category_id);


--
-- Name: password_reset_otp fk_password_reset_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_otp
    ADD CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: reviews fk_reviews_product; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- Name: reviews fk_reviews_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: users fk_users_province; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_province FOREIGN KEY (province_code) REFERENCES public.provinces(code);


--
-- Name: users fk_users_ward; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_ward FOREIGN KEY (ward_code) REFERENCES public.wards(code);


--
-- Name: wards fk_ward_province; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wards
    ADD CONSTRAINT fk_ward_province FOREIGN KEY (province_code) REFERENCES public.provinces(code) ON DELETE CASCADE;


--
-- Name: order_details order_details_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- Name: order_details order_details_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

\unrestrict eQHkR4phO2EogawSlTrhQoJkkEypwTnyHA98YPQFKIQztofwRrudqow5pouUUyO

