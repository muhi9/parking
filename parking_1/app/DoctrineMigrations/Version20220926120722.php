<?php declare(strict_types=1);

namespace Application\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220926120722 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');
        $this->addSql('SET FOREIGN_KEY_CHECKS =0');
        $this->addSql('ALTER TABLE parking CHANGE owner owner INT NOT NULL');
        $this->addSql('ALTER TABLE parking ADD CONSTRAINT FK_B237527ACF60E67C FOREIGN KEY (owner) REFERENCES fos_user (id)');
        $this->addSql('CREATE INDEX IDX_B237527ACF60E67C ON parking (owner)');
        $this->addSql('SET FOREIGN_KEY_CHECKS =1');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE parking DROP FOREIGN KEY FK_B237527ACF60E67C');
        $this->addSql('DROP INDEX IDX_B237527ACF60E67C ON parking');
        $this->addSql('ALTER TABLE parking CHANGE owner owner INT DEFAULT NULL');
    }
}
