<?php

class Orders extends \Phalcon\Mvc\Model
{

    /**
     *
     * @var integer
     */
    public $id;

    /**
     *
     * @var integer
     */
    public $user_id;

    /**
     *
     * @var string
     */
    public $phone;

    /**
     *
     * @var integer
     */
    public $price;

    /**
     *
     * @var string
     */
    public $date;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("public");
        $this->setSource("orders");

        $this->hasOne(
            ['user_id'],
            Users::class,
            ['id'],
            [
                'reusable' => true,
                'alias'    => 'user',
            ]
        );

        $this->hasOne(
            ['status_id'],
            Status::class,
            ['id'],
            [
                'reusable' => true,
                'alias'    => 'status',
            ]
        );

        $this->hasMany(
            'id',
            OrdersPackages::class,
            'orders_id',
            [
                'reusable' => true,
                'alias'    => 'packagesEdge',
            ]
        );

        $this->hasMany(
            'id',
            OrdersGroups::class,
            'orders_id',
            [
                'reusable' => true,
                'alias'    => 'groupsEdge',
            ]
        );

        $this->hasManyToMany(
            'id',
            OrdersGroups::class,
            'orders_id', 'group_id',
            VkGroups::class,
            'id',
            [
                'reusable' => true,
                'alias'    => 'groups',
            ]
        );

        $this->hasManyToMany(
            'id',
            OrdersPackages::class,
            'orders_id', 'packages_id',
            VkGroups::class,
            'id',
            [
                'reusable' => true,
                'alias'    => 'packages',
            ]
        );
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'orders';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return Orders[]|Orders|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return Orders|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
