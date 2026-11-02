<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('folhas_pagamento_proventos_descontos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_folha_pagamento_item');
            $table->unsignedBigInteger('id_provento_desconto');
            $table->decimal('valor', 15, 2);

            $table->foreign('id_folha_pagamento_item', 'fk_folha_prov_item')
                ->references('id')->on('folhas_pagamento_itens')
                ->cascadeOnDelete()->cascadeOnUpdate();

            $table->foreign('id_provento_desconto', 'fk_folha_prov_provento')
                ->references('id')->on('proventos_descontos')
                ->cascadeOnUpdate();

            $table->unique(
                ['id_folha_pagamento_item', 'id_provento_desconto'],
                'uk_folha_prov_item_provento'
            );
            $table->index('id_provento_desconto', 'idx_folha_prov_provento');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('folhas_pagamento_proventos_descontos');
    }
};