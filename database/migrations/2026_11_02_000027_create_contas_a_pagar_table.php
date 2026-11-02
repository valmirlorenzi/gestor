<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contas_pagar', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_filial')->constrained('filiais')->cascadeOnUpdate();
            $table->foreignId('id_nota_fiscal')->nullable()->constrained('notas_fiscais')->cascadeOnUpdate();
            $table->foreignId('id_pessoa')->constrained('pessoas')->cascadeOnUpdate();
            $table->integer('numero_parcela')->default(1);
            $table->integer('total_parcelas')->default(1);
            $table->decimal('valor', 15, 2);
            $table->date('data_emissao');
            $table->date('data_vencimento');
            $table->date('data_pagamento')->nullable();
            $table->decimal('valor_pago', 15, 2)->default(0);
            $table->decimal('juros', 15, 2)->default(0);
            $table->decimal('multa', 15, 2)->default(0);
            $table->decimal('desconto', 15, 2)->default(0);
            $table->string('status', 20)->default('Aberta');
            $table->string('status_fluxo', 30)->nullable();
            $table->foreignId('id_conta_bancaria')->nullable()->constrained('contas_bancarias')->cascadeOnUpdate();
            $table->foreignId('id_forma_pagamento')->nullable()->constrained('formas_pagamento')->cascadeOnUpdate();
            $table->foreignId('id_condicao_pagamento')->nullable()->constrained('condicoes_pagamento')->cascadeOnUpdate();
            $table->foreignId('id_lancamento_baixa')->nullable()->constrained('lancamentos')->cascadeOnUpdate();
            $table->json('dados_extras')->nullable();

            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->index('id_filial');
            $table->index('id_nota_fiscal');
            $table->index('id_pessoa');
            $table->index('data_vencimento');
            $table->index('status');
            $table->index('status_fluxo');
            $table->index('id_conta_bancaria');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contas_pagar');
    }
};