<?php

use yii\db\Migration;

class m200619_200702_chapter_tab extends Migration {

    public function safeUp() {

        $this->createTable('chapters',
                           [
                    "id"         => $this->primaryKey(),
                    "title"      => $this->text(),
                    "tree"       => $this->integer()->notNull(),
                    "lft"        => $this->integer()->notNull(),
                    "rgt"        => $this->integer()->notNull(),
                    "depth"      => $this->integer()->notNull(),
                    "position"   => $this->integer()->notNull()->defaultValue(0),
                    "created_at" => $this->integer()->notNull(),
                    "updated_at" => $this->integer()->notNull(),
                    "_flags"     => $this->integer(11)->defaultValue(0)
        ]);

        $this->createTable("articles",
                           [
                    "id"      => $this->primaryKey(),
                    "title"   => $this->text(),
                    "content" => $this->text(),
                    "_flags"  => $this->integer(11)->defaultValue(0)
        ]);

        $this->createTable("relations",
                           [
                    "chapter" => $this->integer(),
                    "article" => $this->integer(),
                    "sort"    => $this->integer(),
                    "_flags"  => $this->integer(11)->defaultValue(0)
        ]);

        $this->addPrimaryKey("pk_relations", "relations", ["chapter", "article"]);
        $this->addForeignKey("fk_chapter", "relations", "chapter", "chapters",
                             "id", "CASCADE", "CASCADE");
        $this->addForeignKey("fk_article", "relations", "article", "articles",
                             "id", "CASCADE", "CASCADE");
    }

    public function safeDown() {
        $this->dropForeignKey("fk_chapter", "relations");
        $this->dropForeignKey("fk_article", "relations");
        $this->dropTable("chapters");
        $this->dropTable("articles");
        $this->dropTable("relations");
        return true;
    }

}
