<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contas_bancarias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_filial')->constrained('filiais')->cascadeOnUpdate();
            $table->foreignId('id_banco')->constrained('bancos')->cascadeOnUpdate();
            $table->string('agencia', 10)->nullable();
            $table->string('numero', 20)->nullable();
            $table->string('tipo', 20)->nullable(); // Corrente, Poupanca
            $table->decimal('saldo_inicial', 15, 2)->default(0);
            $table->date('saldo_inicial_data')->nullable();
            $table->boolean('ativo')->default(true);
            $table->json('dados_extras')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->index('id_filial');
            $table->index('id_banco');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contas_bancarias');
    }
};