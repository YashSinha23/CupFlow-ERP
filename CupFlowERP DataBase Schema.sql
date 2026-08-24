--
-- PostgreSQL database dump
--

\restrict VQf1WDohgh9WcEcah0q2RMXieExBJfQh7NJcs2Nmw9RppJ7P9zCgpCYgiVAeZcg

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-08-13 20:06:03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16487)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5208 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 907 (class 1247 OID 16563)
-- Name: employment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.employment_status AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public.employment_status OWNER TO postgres;

--
-- TOC entry 943 (class 1247 OID 16774)
-- Name: movement_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.movement_type AS ENUM (
    'STOCK_IN',
    'RESERVED',
    'CONSUMED'
);


ALTER TYPE public.movement_type OWNER TO postgres;

--
-- TOC entry 916 (class 1247 OID 16604)
-- Name: order_stage; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_stage AS ENUM (
    'ORDER_RECEIVED',
    'RAW_MATERIAL_ISSUED',
    'SHEET_MAKING_IN_PROGRESS',
    'SHEET_READY',
    'CUP_MOLDING_IN_PROGRESS',
    'CUPS_READY_FOR_PRINTING',
    'PRINTING_IN_PROGRESS',
    'READY_TO_DISPATCH',
    'DISPATCHED'
);


ALTER TYPE public.order_stage OWNER TO postgres;

--
-- TOC entry 919 (class 1247 OID 16624)
-- Name: order_stock_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_stock_status AS ENUM (
    'PENDING_STOCK',
    'CONFIRMED'
);


ALTER TYPE public.order_stock_status OWNER TO postgres;

--
-- TOC entry 937 (class 1247 OID 16739)
-- Name: reservation_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.reservation_status AS ENUM (
    'ACTIVE',
    'CONSUMED'
);


ALTER TYPE public.reservation_status OWNER TO postgres;

--
-- TOC entry 913 (class 1247 OID 16596)
-- Name: shift_name; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.shift_name AS ENUM (
    'MORNING',
    'AFTERNOON',
    'NIGHT'
);


ALTER TYPE public.shift_name OWNER TO postgres;

--
-- TOC entry 901 (class 1247 OID 16526)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'ADMIN',
    'MANAGER',
    'HR_MANAGER',
    'FLOOR SUPERVISOR',
    'WORKER'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- TOC entry 268 (class 1255 OID 33089)
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16720)
-- Name: bom; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bom (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cup_type character varying(100) NOT NULL,
    material_id uuid NOT NULL,
    qty_per_unit numeric(10,5) NOT NULL,
    CONSTRAINT bom_qty_per_unit_check CHECK ((qty_per_unit > (0)::numeric))
);


ALTER TABLE public.bom OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 24925)
-- Name: dispatch_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dispatch_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    dispatch_date date NOT NULL,
    transporter_name character varying(255),
    vehicle_number character varying(50),
    dispatched_by uuid NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.dispatch_records OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16570)
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    full_name character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    department character varying(255) NOT NULL,
    date_of_joining date,
    contact_phone character varying(20),
    contact_email character varying(255),
    status public.employment_status DEFAULT 'ACTIVE'::public.employment_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16705)
-- Name: materials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.materials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    material_type character varying(255) NOT NULL,
    unit character varying(20) NOT NULL,
    min_threshold numeric(10,3) DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.materials OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16676)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_code character varying(30) NOT NULL,
    customer_name character varying(255) NOT NULL,
    cup_type character varying(100) NOT NULL,
    cup_quantity integer NOT NULL,
    expected_delivery date NOT NULL,
    current_stage public.order_stage DEFAULT 'ORDER_RECEIVED'::public.order_stage NOT NULL,
    stock_status public.order_stock_status DEFAULT 'PENDING_STOCK'::public.order_stock_status NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT orders_cup_quantity_check CHECK ((cup_quantity > 0))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 24897)
-- Name: production_stage_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.production_stage_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    from_stage public.order_stage NOT NULL,
    to_stage public.order_stage NOT NULL,
    quantity_reported integer,
    notes text,
    performed_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT no_backward_transition CHECK ((from_stage < to_stage))
);


ALTER TABLE public.production_stage_logs OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16632)
-- Name: shifts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shifts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name public.shift_name NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.shifts OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16646)
-- Name: shifts_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shifts_assignments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_id uuid NOT NULL,
    shift_id uuid NOT NULL,
    assigned_from date NOT NULL,
    assigned_to date,
    assigned_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.shifts_assignments OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16781)
-- Name: stock_ledger; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_ledger (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    material_id uuid NOT NULL,
    movement_type public.movement_type NOT NULL,
    quantity numeric(10,3) NOT NULL,
    order_id uuid,
    supplier_name character varying(255),
    performed_by uuid NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.stock_ledger OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16743)
-- Name: stock_reservations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_reservations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    material_id uuid NOT NULL,
    reserved_qty numeric(10,3) NOT NULL,
    status public.reservation_status DEFAULT 'ACTIVE'::public.reservation_status NOT NULL,
    consumed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT stock_reservations_reserved_qty_check CHECK ((reserved_qty > (0)::numeric))
);


ALTER TABLE public.stock_reservations OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16537)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role public.user_role NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    full_name character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 5014 (class 2606 OID 16730)
-- Name: bom bom_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bom
    ADD CONSTRAINT bom_pkey PRIMARY KEY (id);


--
-- TOC entry 5034 (class 2606 OID 24938)
-- Name: dispatch_records dispatch_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dispatch_records
    ADD CONSTRAINT dispatch_records_pkey PRIMARY KEY (id);


--
-- TOC entry 4994 (class 2606 OID 16587)
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- TOC entry 4996 (class 2606 OID 16589)
-- Name: employees employees_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_key UNIQUE (user_id);


--
-- TOC entry 5010 (class 2606 OID 16719)
-- Name: materials materials_material_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_material_type_key UNIQUE (material_type);


--
-- TOC entry 5012 (class 2606 OID 16717)
-- Name: materials materials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_pkey PRIMARY KEY (id);


--
-- TOC entry 5002 (class 2606 OID 16660)
-- Name: shifts_assignments no_overlapping_active; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shifts_assignments
    ADD CONSTRAINT no_overlapping_active UNIQUE (employee_id, assigned_from);


--
-- TOC entry 5036 (class 2606 OID 24940)
-- Name: dispatch_records one_dispatch_per_order; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dispatch_records
    ADD CONSTRAINT one_dispatch_per_order UNIQUE (order_id);


--
-- TOC entry 5021 (class 2606 OID 16759)
-- Name: stock_reservations one_reservation_per_order_material; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_reservations
    ADD CONSTRAINT one_reservation_per_order_material UNIQUE (order_id, material_id);


--
-- TOC entry 5006 (class 2606 OID 16699)
-- Name: orders orders_order_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_code_key UNIQUE (order_code);


--
-- TOC entry 5008 (class 2606 OID 16697)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 5032 (class 2606 OID 24912)
-- Name: production_stage_logs production_stage_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_stage_logs
    ADD CONSTRAINT production_stage_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5004 (class 2606 OID 16658)
-- Name: shifts_assignments shifts_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shifts_assignments
    ADD CONSTRAINT shifts_assignments_pkey PRIMARY KEY (id);


--
-- TOC entry 4998 (class 2606 OID 16645)
-- Name: shifts shifts_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shifts
    ADD CONSTRAINT shifts_name_key UNIQUE (name);


--
-- TOC entry 5000 (class 2606 OID 16643)
-- Name: shifts shifts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shifts
    ADD CONSTRAINT shifts_pkey PRIMARY KEY (id);


--
-- TOC entry 5028 (class 2606 OID 16796)
-- Name: stock_ledger stock_ledger_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_ledger
    ADD CONSTRAINT stock_ledger_pkey PRIMARY KEY (id);


--
-- TOC entry 5023 (class 2606 OID 16757)
-- Name: stock_reservations stock_reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_reservations
    ADD CONSTRAINT stock_reservations_pkey PRIMARY KEY (id);


--
-- TOC entry 5016 (class 2606 OID 16732)
-- Name: bom unique_bom_entry; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bom
    ADD CONSTRAINT unique_bom_entry UNIQUE (cup_type, material_id);


--
-- TOC entry 4990 (class 2606 OID 16556)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4992 (class 2606 OID 16554)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5024 (class 1259 OID 16814)
-- Name: idx_ledger_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ledger_created_at ON public.stock_ledger USING btree (created_at DESC);


--
-- TOC entry 5025 (class 1259 OID 16812)
-- Name: idx_ledger_material; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ledger_material ON public.stock_ledger USING btree (material_id);


--
-- TOC entry 5026 (class 1259 OID 16813)
-- Name: idx_ledger_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ledger_order ON public.stock_ledger USING btree (order_id);


--
-- TOC entry 5017 (class 1259 OID 16771)
-- Name: idx_reservations_material; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_material ON public.stock_reservations USING btree (material_id);


--
-- TOC entry 5018 (class 1259 OID 16770)
-- Name: idx_reservations_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_order ON public.stock_reservations USING btree (order_id);


--
-- TOC entry 5019 (class 1259 OID 16772)
-- Name: idx_reservations_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_status ON public.stock_reservations USING btree (status);


--
-- TOC entry 5029 (class 1259 OID 24923)
-- Name: idx_stage_logs_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stage_logs_order_id ON public.production_stage_logs USING btree (order_id);


--
-- TOC entry 5030 (class 1259 OID 24924)
-- Name: idx_stage_logs_performed_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stage_logs_performed_by ON public.production_stage_logs USING btree (performed_by);


--
-- TOC entry 5054 (class 2620 OID 33091)
-- Name: employees trg_employees_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 5055 (class 2620 OID 33090)
-- Name: orders trg_orders_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 5053 (class 2620 OID 33092)
-- Name: users trg_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 5043 (class 2606 OID 16733)
-- Name: bom bom_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bom
    ADD CONSTRAINT bom_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id);


--
-- TOC entry 5051 (class 2606 OID 24946)
-- Name: dispatch_records dispatch_records_dispatched_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dispatch_records
    ADD CONSTRAINT dispatch_records_dispatched_by_fkey FOREIGN KEY (dispatched_by) REFERENCES public.users(id);


--
-- TOC entry 5052 (class 2606 OID 24941)
-- Name: dispatch_records dispatch_records_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dispatch_records
    ADD CONSTRAINT dispatch_records_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 5038 (class 2606 OID 16590)
-- Name: employees employees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5042 (class 2606 OID 16700)
-- Name: orders orders_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 5049 (class 2606 OID 24913)
-- Name: production_stage_logs production_stage_logs_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_stage_logs
    ADD CONSTRAINT production_stage_logs_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 5050 (class 2606 OID 24918)
-- Name: production_stage_logs production_stage_logs_performed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_stage_logs
    ADD CONSTRAINT production_stage_logs_performed_by_fkey FOREIGN KEY (performed_by) REFERENCES public.users(id);


--
-- TOC entry 5039 (class 2606 OID 16671)
-- Name: shifts_assignments shifts_assignments_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shifts_assignments
    ADD CONSTRAINT shifts_assignments_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id);


--
-- TOC entry 5040 (class 2606 OID 16661)
-- Name: shifts_assignments shifts_assignments_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shifts_assignments
    ADD CONSTRAINT shifts_assignments_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 5041 (class 2606 OID 16666)
-- Name: shifts_assignments shifts_assignments_shift_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shifts_assignments
    ADD CONSTRAINT shifts_assignments_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES public.shifts(id);


--
-- TOC entry 5046 (class 2606 OID 16797)
-- Name: stock_ledger stock_ledger_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_ledger
    ADD CONSTRAINT stock_ledger_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id);


--
-- TOC entry 5047 (class 2606 OID 16802)
-- Name: stock_ledger stock_ledger_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_ledger
    ADD CONSTRAINT stock_ledger_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 5048 (class 2606 OID 16807)
-- Name: stock_ledger stock_ledger_performed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_ledger
    ADD CONSTRAINT stock_ledger_performed_by_fkey FOREIGN KEY (performed_by) REFERENCES public.users(id);


--
-- TOC entry 5044 (class 2606 OID 16765)
-- Name: stock_reservations stock_reservations_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_reservations
    ADD CONSTRAINT stock_reservations_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id);


--
-- TOC entry 5045 (class 2606 OID 16760)
-- Name: stock_reservations stock_reservations_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_reservations
    ADD CONSTRAINT stock_reservations_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 5037 (class 2606 OID 16557)
-- Name: users users_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


-- Completed on 2026-08-13 20:06:03

--
-- PostgreSQL database dump complete
--

\unrestrict VQf1WDohgh9WcEcah0q2RMXieExBJfQh7NJcs2Nmw9RppJ7P9zCgpCYgiVAeZcg

