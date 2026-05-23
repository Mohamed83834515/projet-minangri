export interface TypeActivite extends Record<string, unknown> {
  id_type: number;
  code_type: string;
  intutile_type: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}
