<?php 

use Phalcon\Db\Column;
use Phalcon\Db\Index;
use Phalcon\Db\Reference;
use Phalcon\Mvc\Model\Migration;

/**
 * Class GroupsMigration_107
 */
class GroupsMigration_107 extends Migration
{
    /**
     * Define the table structure
     *
     * @return void
     */
    public function morph()
    {
        $this->morphTable('groups', [
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
                        'vk_group_id',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'notNull' => true,
                            'after' => 'id'
                        ]
                    ),
                    new Column(
                        'name',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'notNull' => true,
                            'size' => 70,
                            'after' => 'vk_group_id'
                        ]
                    ),
                    new Column(
                        'screen_name',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'notNull' => true,
                            'size' => 70,
                            'after' => 'name'
                        ]
                    ),
                    new Column(
                        'avatar',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'notNull' => true,
                            'size' => 140,
                            'after' => 'screen_name'
                        ]
                    ),
                    new Column(
                        'likes',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'after' => 'avatar'
                        ]
                    ),
                    new Column(
                        'views',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'after' => 'likes'
                        ]
                    ),
                    new Column(
                        'reposts',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'after' => 'views'
                        ]
                    ),
                    new Column(
                        'members',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'after' => 'reposts'
                        ]
                    )
                ],
                'indexes' => [
                    new Index('groups_pkey', ['id'], null),
                    new Index('vk_group_id', ['vk_group_id'], null)
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
        self::$connection->addColumn('groups', 'public', new Column(
            'price',
            [
                'type' => Column::TYPE_INTEGER,
                'notNull' => true,
                'default' => 0
            ]
        ));
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
