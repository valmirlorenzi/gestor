<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement(<<<'SQL'
            CREATE VIEW vw_posicao_caixa AS
            SELECT
                f.id AS id_filial,
                COALESCE(SUM(v.saldo_atual), 0) +
                    COALESCE((
                        SELECT SUM(cr.valor)
                        FROM contas_receber cr
                        WHERE cr.id_filial = f.id
                          AND cr.status IN ('Aberta', 'Parcialmente baixada')
                          AND cr.deleted_at IS NULL
                    ), 0) -
                    COALESCE((
                        SELECT SUM(cp.valor)
                        FROM contas_pagar cp
                        WHERE cp.id_filial = f.id
                          AND cp.status IN ('Aberta', 'Parcialmente baixada')
                          AND cp.deleted_at IS NULL
                    ), 0) AS saldo_projetado
            FROM filiais f
            LEFT JOIN vw_saldo_contas_bancarias v ON v.id_filial = f.id
            WHERE f.deleted_at IS NULL
              AND f.ativo = 1
            GROUP BY f.id
        SQL);
    }

    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS vw_posicao_caixa');
    }
};
