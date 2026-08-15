-- Add the unique API-key guard and atomic account + credential creation.
-- Apply this migration to the connected Supabase database before using the form.

do $$
begin
  alter table public.kite_credentials
    add constraint kite_credentials_api_key_key unique (api_key);
exception
  when duplicate_object then null;
end;
$$;

create or replace function public.create_client_account_with_credentials(
  p_name text,
  p_zerodha_client_id text,
  p_email text,
  p_phone text,
  p_capital_contributed numeric,
  p_profit_share_percent numeric,
  p_status text,
  p_joined_date date,
  p_notes text,
  p_api_key text,
  p_api_secret text,
  p_zerodha_password text
)
returns public.client_accounts
language plpgsql
set search_path = public
as $$
declare
  created_account public.client_accounts;
begin
  insert into public.client_accounts (
    name, zerodha_client_id, email, phone, capital_contributed,
    profit_share_percent, status, joined_date, notes
  ) values (
    p_name, p_zerodha_client_id, p_email, p_phone, p_capital_contributed,
    p_profit_share_percent, p_status, p_joined_date, p_notes
  ) returning * into created_account;

  insert into public.kite_credentials (
    account_id, api_key, api_secret, zerodha_password, access_token
  ) values (
    created_account.id, p_api_key, p_api_secret, p_zerodha_password, null
  );

  return created_account;
end;
$$;

revoke all on function public.create_client_account_with_credentials(
  text, text, text, text, numeric, numeric, text, date, text, text, text, text
) from public, anon, authenticated;
grant execute on function public.create_client_account_with_credentials(
  text, text, text, text, numeric, numeric, text, date, text, text, text, text
) to service_role;
