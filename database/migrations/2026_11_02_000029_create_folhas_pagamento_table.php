<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('folhas_pagamento', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_filial')->constrained('filiais')->cascadeOnUpdate();
            $table->foreignId('id_periodo')->constrained('periodos')->cascadeOnUpdate();
            $table->char('mes_ano_referencia', 7);
            $table->string('status', 20);
            $table->foreignId('id_lancamento')->nullable()->constrained('lancamentos')->cascadeOnUpdate();
            $table->json('dados_extras')->nullable();

            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->index('id_filial');
            $table->index('id_periodo');
            $table->index('status');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('folhas_pagamento');
    }
};