<?php declare(strict_types=1);

namespace Application\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220803121017 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE parking (id INT AUTO_INCREMENT NOT NULL, created_by INT DEFAULT NULL, updated_by INT DEFAULT NULL, longitude VARCHAR(200) DEFAULT NULL, latitude VARCHAR(200) DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, deleted_at DATETIME DEFAULT NULL, INDEX IDX_B237527ADE12AB56 (created_by), INDEX IDX_B237527A16FE72E1 (updated_by), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE parking_spaces (id INT AUTO_INCREMENT NOT NULL, parking INT NOT NULL, created_by INT DEFAULT NULL, updated_by INT DEFAULT NULL, name VARCHAR(200) DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, deleted_at DATETIME DEFAULT NULL, INDEX IDX_893C47E5B237527A (parking), INDEX IDX_893C47E5DE12AB56 (created_by), INDEX IDX_893C47E516FE72E1 (updated_by), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE parking ADD CONSTRAINT FK_B237527ADE12AB56 FOREIGN KEY (created_by) REFERENCES fos_user (id)');
        $this->addSql('ALTER TABLE parking ADD CONSTRAINT FK_B237527A16FE72E1 FOREIGN KEY (updated_by) REFERENCES fos_user (id)');
        $this->addSql('ALTER TABLE parking_spaces ADD CONSTRAINT FK_893C47E5B237527A FOREIGN KEY (parking) REFERENCES parking (id)');
        $this->addSql('ALTER TABLE parking_spaces ADD CONSTRAINT FK_893C47E5DE12AB56 FOREIGN KEY (created_by) REFERENCES fos_user (id)');
        $this->addSql('ALTER TABLE parking_spaces ADD CONSTRAINT FK_893C47E516FE72E1 FOREIGN KEY (updated_by) REFERENCES fos_user (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE parking_spaces DROP FOREIGN KEY FK_893C47E5B237527A');
        $this->addSql('DROP TABLE parking');
        $this->addSql('DROP TABLE parking_spaces');
    }
}
