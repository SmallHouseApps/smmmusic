<?php 

use Phalcon\Db\Column;
use Phalcon\Db\Index;
use Phalcon\Db\Reference;
use Phalcon\Mvc\Model\Migration;

/**
 * Class RolesMigration_103
 */
class RolesMigration_103 extends Migration
{
    /**
     * Define the table structure
     *
     * @return void
     */
    public function morph()
    {
        $this->morphTable('roles', [
                'columns' => [
                    new Column(
                        'id',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'notNull' => true,
                            'autoIncrement' => true,
                            'first' => true
                        ]
                    ),
                    new Column(
                        'name',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'notNull' => true,
                            'size' => 70,
                            'after' => 'id'
                        ]
                    )
                ],
                'indexes' => [
                    new Index('roles_pkey', ['id'], null)
                ],
            ]
        );
    }

    /**
     * Run the migrations
     *
     * @return void
     */
    public function up()
    {
        self::$connection->addColumn('roles', 'public', new Column(
            'value',
            [
                'type' => Column::TYPE_VARCHAR,
                'notNull' => true,
                'size' => 70,
                'after' => 'roles.id'
            ]
        ));

        self::$connection->insert(
            'roles',
            [
                'Клиент',
                'client',
            ],
            [
                'name',
                'value',
            ]
        );

        self::$connection->insert(
            'roles',
            [
                'Менеджер',
                'manager',
            ],
            [
                'name',
                'value',
            ]
        );

        self::$connection->insert(
            'roles',
            [
                'Системный администратор',
                'administrator',
            ],
            [
                'name',
                'value',
            ]
        );
    }

    /**
     * Reverse the migrations
     *
     * @return void
     */
    public function down()
    {

    }

}
