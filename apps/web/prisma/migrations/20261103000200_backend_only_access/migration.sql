-- Only the dedicated Next.js runtime role can access domain tables.
-- Public Data API is disabled independently in the new project dashboard.
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'reuse_lab_runtime') THEN
        CREATE ROLE reuse_lab_runtime NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
    END IF;
END $$;
REVOKE ALL ON SCHEMA public FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA public TO reuse_lab_runtime;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON SEQUENCES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM PUBLIC, anon, authenticated;
DO $$ DECLARE domain_table TEXT; BEGIN
    FOREACH domain_table IN ARRAY ARRAY['users', 'domain_auth_sessions', 'accounts', 'password_reset_tokens',
        'rate_limit_buckets', 'assistant_confirmations', 'categories', 'items', 'item_images',
        'notifications', 'conversations', 'messages'] LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', domain_table);
        EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.%I TO reuse_lab_runtime', domain_table);
        EXECUTE format('CREATE POLICY backend_only ON public.%I FOR ALL TO reuse_lab_runtime USING (true) WITH CHECK (true)', domain_table);
    END LOOP;
END $$;
