
-- Insert company data

INSERT INTO public.company_base_data
(id, bpn, company_name, street, "number", zip_code, country, my_company, edc_url, counter)
VALUES('415d75e2-bcd3-45d6-8948-36cbb3ff244c'::uuid, 'BPNL0000000009T3', 'CUSTOMER Company A', 'Some address of A', '1', '382355', 'Germany', 'CUSTOMER Company A', NULL, 12);

INSERT INTO public.company_base_data
(id, bpn, company_name, street, "number", zip_code, country, my_company, edc_url, counter)
VALUES('c19bb7fd-4929-46f8-9f84-95eb0baa6125'::uuid, 'BPNL0000000007UH', 'SUPPLIER Company B', 'Some address of B', '4', '382355', 'Germany', 'SUPPLIER Company B', NULL, 0);


-- Insert User data

INSERT INTO public.dcm_users
(id, "name", last_name, email, username, company_id, "role")
VALUES('51d8bd26-e699-4bdc-b453-0422a671631c'::uuid, '', '', '', 'dcm_admin', '415d75e2-bcd3-45d6-8948-36cbb3ff244c'::uuid, 'ADMIN');
INSERT INTO public.dcm_users
(id, "name", last_name, email, username, company_id, "role")
VALUES('fa3911bb-2f27-402b-bf72-e1b4a2064b4e'::uuid, '', '', '', 'supplier', 'c19bb7fd-4929-46f8-9f84-95eb0baa6125'::uuid, 'SUPPLIER');
INSERT INTO public.dcm_users
(id, "name", last_name, email, username, company_id, "role")
VALUES('ef15c278-a1e5-4871-bb99-dd1744de4ec5'::uuid, '', '', '', 'customer', '415d75e2-bcd3-45d6-8948-36cbb3ff244c'::uuid, 'CUSTOMER');
