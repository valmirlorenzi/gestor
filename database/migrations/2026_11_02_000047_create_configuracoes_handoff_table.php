<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('configuracoes_handoff', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_empresa');
            $table->boolean('handoff_ativo')->default(true);
            $table->json('dados_extras')->nullable();

            $table->timestamps();

            $table->foreign('id_empresa', 'fk_config_handoff_empresa')
                ->references('id')->on('empresas')->cascadeOnUpdate();

            $table->unique('id_empresa', 'uk_config_handoff_empresa');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('configuracoes_handoff');
    }
};