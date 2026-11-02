<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('funcionarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_pessoa')->unique()->constrained('pessoas')->cascadeOnUpdate();
            $table->foreignId('id_filial')->constrained('filiais')->cascadeOnUpdate();
            $table->string('cargo', 100)->nullable();
            $table->foreignId('id_centro_custo')->nullable()->constrained('centros_custo')->cascadeOnUpdate();
            $table->decimal('salario_base', 15, 2)->default(0);
            $table->date('data_admissao');
            $table->date('data_demissao')->nullable();
            $table->string('natureza', 10); // Custo, Despesa Fixa
            $table->boolean('ativo')->default(true);
            $table->json('dados_extras')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->index('id_filial');
            $table->index('id_centro_custo');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('funcionarios');
    }
};