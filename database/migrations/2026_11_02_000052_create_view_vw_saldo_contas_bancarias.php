<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement(<<<'SQL'
            CREATE VIEW vw_saldo_contas_bancarias AS
            SELECT
                cb.id_filial,
                cb.id,
                cb.agencia,
                cb.numero,
                cb.saldo_inicial +
                    COALESCE((
                        SELECT SUM(cr.valor_recebido)
                        FROM contas_receber cr
                        WHERE cr.id_conta_bancaria = cb.id
                          AND cr.status = 'Baixada'
                    ), 0) -
                    COALESCE((
                        SELECT SUM(cp.valor_pago)
                        FROM contas_pagar cp
                        WHERE cp.id_conta_bancaria = cb.id
                          AND cp.status = 'Baixada'
                    ), 0) AS saldo_atual
            FROM contas_bancarias cb
            WHERE cb.deleted_at IS NULL
              AND cb.ativo = 1
        SQL);
    }

    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS vw_saldo_contas_bancarias');
    }
};