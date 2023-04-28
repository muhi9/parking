<?php declare(strict_types=1);

namespace Application\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220824121042 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE parking ADD work_time VARCHAR(200) DEFAULT NULL, DROP type_of_motor_vehicle, DROP price_of_hour');
        $this->addSql('ALTER TABLE parking_spaces ADD type_of_motor_vehicle VARCHAR(100) DEFAULT NULL, ADD price_of_hour VARCHAR(100) DEFAULT NULL, CHANGE name addres VARCHAR(200) DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE parking ADD type_of_motor_vehicle VARCHAR(100) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_unicode_ci`, ADD price_of_hour VARCHAR(100) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_unicode_ci`, DROP work_time');
        $this->addSql('ALTER TABLE parking_spaces DROP type_of_motor_vehicle, DROP price_of_hour, CHANGE addres name VARCHAR(200) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_unicode_ci`');
    }
}
