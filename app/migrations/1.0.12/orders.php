<?php 

use Phalcon\Db\Column;
use Phalcon\Db\Index;
use Phalcon\Db\Reference;
use Phalcon\Mvc\Model\Migration;

/**
 * Class OrdersMigration_112
 */
class OrdersMigration_112 extends Migration
{
    /**
     * Define the table structure
     *
     * @return void
     */
    public function morph()
    {
        $this->morphTable('orders', [
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
                        'user_id',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'notNull' => true,
                            'after' => 'id'
                        ]
                    ),
                    new Column(
                        'price',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'notNull' => true,
                            'after' => 'user_id'
                        ]
                    ),
                    new Column(
                        'date',
                        [
                            'type' => Column::TYPE_DATE,
                            'notNull' => true,
                            'size' => 1,
                            'after' => 'price'
                        ]
                    ),
                    new Column(
                        'phone',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'after' => 'date'
                        ]
                    )
                ],
                'indexes' => [
                    new Index('orders_pkey', ['id'], null),
                    new Index('orders_user_id', ['user_id'], null)
                ],
                'references' => [
                    new Reference(
                        'order_user',
                        [
                            'referencedTable' => 'users',
                            'referencedSchema' => 'public',
                            'columns' => ['user_id'],
                            'referencedColumns' => ['id'],
                            'onUpdate' => 'NO ACTION',
                            'onDelete' => 'NO ACTION'
                        ]
                    )
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
        $sql = 'ALTER TABLE orders ' .
               'ALTER COLUMN phone TYPE VARCHAR';

        self::$connection->query($sql);
        self::$connection->addColumn('orders', 'public', new Column(
            'status_id',
            [
                'type' => Column::TYPE_INTEGER,
                'notNull' => true,
                'default' => 1
            ]
        ));

        self::$connection->addIndex('orders', 'public', new Index('orders_status_id', ['status_id'], null));
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
