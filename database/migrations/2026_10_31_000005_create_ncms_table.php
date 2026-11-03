<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ncms', function (Blueprint $table) {
            $table->id();
            $table->char('codigo', 8)->unique();
            $table->string('descricao', 300);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ncms');
    }
};
