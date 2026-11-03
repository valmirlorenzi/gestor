<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('periodos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_filial')->constrained('filiais')->cascadeOnUpdate();
            $table->char('mes_ano', 7); // MM/AAAA
            $table->string('status', 20); // Aberto, Em fechamento, Fechado
            $table->timestamp('data_fechamento')->nullable();
            $table->foreignId('id_usuario_fechamento')->nullable()->constrained('usuarios')->cascadeOnUpdate();
            $table->json('dados_extras')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->unique(['id_filial', 'mes_ano']);
            $table->index('status');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('periodos');
    }
};
