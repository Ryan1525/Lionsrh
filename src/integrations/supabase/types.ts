export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      atestados: {
        Row: {
          cid: string | null
          created_at: string
          data_inicio: string
          dias: number
          funcionario_id: string
          id: string
          motivo: string | null
        }
        Insert: {
          cid?: string | null
          created_at?: string
          data_inicio: string
          dias?: number
          funcionario_id: string
          id?: string
          motivo?: string | null
        }
        Update: {
          cid?: string | null
          created_at?: string
          data_inicio?: string
          dias?: number
          funcionario_id?: string
          id?: string
          motivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "atestados_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      declaracoes: {
        Row: {
          conteudo: string
          created_at: string
          funcionario_id: string
          id: string
          tipo: string
        }
        Insert: {
          conteudo: string
          created_at?: string
          funcionario_id: string
          id?: string
          tipo?: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          funcionario_id?: string
          id?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "declaracoes_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos: {
        Row: {
          created_at: string
          funcionario_id: string
          id: string
          modulo: string | null
          nome: string
          registro_id: string | null
          storage_path: string | null
          tamanho: number | null
          tipo: string
        }
        Insert: {
          created_at?: string
          funcionario_id: string
          id?: string
          modulo?: string | null
          nome: string
          registro_id?: string | null
          storage_path?: string | null
          tamanho?: number | null
          tipo?: string
        }
        Update: {
          created_at?: string
          funcionario_id?: string
          id?: string
          modulo?: string | null
          nome?: string
          registro_id?: string | null
          storage_path?: string | null
          tamanho?: number | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      ferias: {
        Row: {
          created_at: string
          data_fim: string
          data_inicio: string
          dias: number
          funcionario_id: string
          id: string
          observacao: string | null
          status: string
        }
        Insert: {
          created_at?: string
          data_fim: string
          data_inicio: string
          dias?: number
          funcionario_id: string
          id?: string
          observacao?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          data_fim?: string
          data_inicio?: string
          dias?: number
          funcionario_id?: string
          id?: string
          observacao?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ferias_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      folha_pagamento: {
        Row: {
          adicionais: number
          competencia: string
          created_at: string
          descontos: number
          funcionario_id: string
          id: string
          liquido: number
          salario_base: number
          status: string
          vale_alimentacao: number
          vale_transporte: number
        }
        Insert: {
          adicionais?: number
          competencia: string
          created_at?: string
          descontos?: number
          funcionario_id: string
          id?: string
          liquido?: number
          salario_base?: number
          status?: string
          vale_alimentacao?: number
          vale_transporte?: number
        }
        Update: {
          adicionais?: number
          competencia?: string
          created_at?: string
          descontos?: number
          funcionario_id?: string
          id?: string
          liquido?: number
          salario_base?: number
          status?: string
          vale_alimentacao?: number
          vale_transporte?: number
        }
        Relationships: [
          {
            foreignKeyName: "folha_pagamento_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios: {
        Row: {
          cargo: string
          cpf: string | null
          created_at: string
          data_admissao: string
          data_desligamento: string | null
          departamento: string
          email: string | null
          id: string
          matricula: string
          motivo_desligamento: string | null
          nome: string
          salario_base: number
          status: string
          telefone: string | null
          vale_alimentacao: number
          vale_transporte: number
        }
        Insert: {
          cargo: string
          cpf?: string | null
          created_at?: string
          data_admissao: string
          data_desligamento?: string | null
          departamento: string
          email?: string | null
          id?: string
          matricula: string
          motivo_desligamento?: string | null
          nome: string
          salario_base?: number
          status?: string
          telefone?: string | null
          vale_alimentacao?: number
          vale_transporte?: number
        }
        Update: {
          cargo?: string
          cpf?: string | null
          created_at?: string
          data_admissao?: string
          data_desligamento?: string | null
          departamento?: string
          email?: string | null
          id?: string
          matricula?: string
          motivo_desligamento?: string | null
          nome?: string
          salario_base?: number
          status?: string
          telefone?: string | null
          vale_alimentacao?: number
          vale_transporte?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          role: string
          user_id: string
        }
        Insert: {
          role?: string
          user_id: string
        }
        Update: {
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
