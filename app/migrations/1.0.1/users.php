<?php 

use Phalcon\Db\Column;
use Phalcon\Db\Index;
use Phalcon\Db\Reference;
use Phalcon\Mvc\Model\Migration;

/**
 * Class UsersMigration_101
 */
class UsersMigration_101 extends Migration
{
    /**
     * Run the migrations
     *
     * @return void
     */
    public function up()
    {
        $this->morphTable('users', [
                'columns' => [
                    new Column(
                        'id',
                        [
                            'type' => Column::TYPE_INTEGER,
                            'unsigned'      => true,
                            'notNull'       => true,
                            'autoIncrement' => true,
                            'first'         => true,
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
                    ),
                    new Column(
                        'email',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'notNull' => true,
                            'size' => 70,
                            'after' => 'name'
                        ]
                    ),
                    new Column(
                        'password',
                        [
                            'type' => Column::TYPE_VARCHAR,
                            'notNull' => true,
                            'size' => 140,
                            'after' => 'email'
                        ]
                    ),
                    new Column(
                        'is_active',
                        [
                            'type' => Column::TYPE_BOOLEAN,
                            'notNull' => true,
                            'default' => 'false',
                            'after' => 'password'
                        ]
                    ),
                    new Column(
                        'is_admin',
                        [
                            'type' => Column::TYPE_BOOLEAN,
                            'notNull' => true,
                            'default' => 'false',
                            'after' => 'is_active'
                        ]
                    ),
                    new Column(
                        'created_at',
                        [
                            'type' => Column::TYPE_TIMESTAMP,
                            'notNull' => true,
                            'default' => 'now()',
                            'after' => 'is_admin'
                        ]
                    ),
                    new Column(
                        'updated_at',
                        [
                            'type' => Column::TYPE_TIMESTAMP,
                            'notNull' => true,
                            'default' => 'now()',
                            'after' => 'created_at'
                        ]
                    ),
                ],
                'indexes' => [
                    new Index('email_UNIQUE', ['email'], 'UNIQUE'),
                ],
                'options' => [
                    'TABLE_TYPE'      => 'BASE TABLE',
                    'ENGINE'          => 'InnoDB',
                    'TABLE_COLLATION' => 'utf8_general_ci',
                ],
            ]
        );

        $sql = 'ALTER TABLE users ADD PRIMARY KEY (id)';
        self::$connection->query($sql);
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
