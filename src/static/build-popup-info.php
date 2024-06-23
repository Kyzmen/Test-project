<?
$array = [
    "0" => [
        "title" => 'BUILDING #0',
        "text" => 'LOREM IPSUM',
        "innerTitle" => 'Сдача будинку 4 квартал 2020 року',
        "items" => [
            [
                "title" => 'Blagoustriy',
                "value" => '60',
                "text" => 'Additionally the following key casts will occur:',
            ],
            [
                "title" => 'Blagoustriy',
                "value" => '70',
                "text" => 'Additionally the following key casts will occur:',
            ],
            [
                "title" => 'Blagoustriy',
                "value" => '80',
                "text" => 'Additionally the following key casts will occur:',
            ],
            [
                "title" => 'Blagoustriy',
                "value" => '90',
                "text" => 'Additionally the following key casts will occur:',
            ],
        ]
    ],
    "1" => [
        "title" => 'BUILDING #2',
        "text" => 'LOREM IPSUM',
        "innerTitle" => 'Сдача будинку 4 квартал 3521 року',
        "items" => [
            [
                "title" => 'Blagoustriy',
                "value" => '30',
                "text" => 'Additionally the following key casts will occur:',
            ],
            [
                "title" => 'Blagoustriy',
                "value" => '30',
                "text" => 'Additionally the following key casts will occur:',
            ],
            [
                "title" => 'Blagoustriy',
                "value" => '30',
                "text" => 'Additionally the following key casts will occur:',
            ],
            [
                "title" => 'Blagoustriy',
                "value" => '40',
                "text" => 'Additionally the following key casts will occur:',
            ],
            [
                "title" => 'Blagoustriy',
                "value" => '50',
                "text" => 'Additionally the following key casts will occur:',
            ],
            [
                "title" => 'Blagoustriy',
                "value" => '60',
                "text" => 'Additionally the following key casts will occur:',
            ],
        ]
    ],
];

$idToReturn = $_GET['id'] ? $_GET['id'] : 0; 
echo json_encode($array[$idToReturn] ? $array[$idToReturn] : $array[0]);