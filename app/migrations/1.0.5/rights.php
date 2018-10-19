<?php 

use Phalcon\Db\Column;
use Phalcon\Db\Index;
use Phalcon\Db\Reference;
use Phalcon\Mvc\Model\Migration;

/**
 * Class RightsMigration_105
 */
class RightsMigration_105 extends Migration
{
    /**
     * Run the migrations
     *
     * @return void
     */
    public function up()
    {
        self::$connection->addIndex('rights', 'public', new Index('role_id_UNIQUE', ['role_id'], 'UNIQUE'));

        self::$connection->insert(
            'rights',
            [
                1,
                '{ "VkGroups": ["index", "search"] }',
            ],
            [
                'role_id',
                'regions',
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
