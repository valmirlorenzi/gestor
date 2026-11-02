<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement(<<<'SQL'
            CREATE VIEW vw_caixa_entrada AS
            SELECT
                t.id,
                t.id_filial,
                t.tipo_ordem,
                t.id_documento,
                t.tipo_documento,
                t.id_ator_origem,
                t.id_ator_destino,
                t.status,
                t.urgente,
                t.data_criacao,
                t.descricao_resumida,
                t.prioridade
            FROM tarefas t
            WHERE t.status IN ('pendente', 'em_andamento')
              AND t.deleted_at IS NULL
            ORDER BY t.urgente DESC, t.prioridade DESC, t.data_criacao ASC
        SQL);
    }

    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS vw_caixa_entrada');
    }
};