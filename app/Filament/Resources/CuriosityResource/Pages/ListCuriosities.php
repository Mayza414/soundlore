<?php

namespace App\Filament\Resources\CuriosityResource\Pages;

use App\Filament\Resources\CuriosityResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListCuriosities extends ListRecords
{
    protected static string $resource = CuriosityResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
