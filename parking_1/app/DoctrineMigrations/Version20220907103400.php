<?php declare(strict_types=1);

namespace Application\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220907103400 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE reservation ADD created_by INT DEFAULT NULL, ADD updated_by INT DEFAULT NULL, ADD created_at DATETIME NOT NULL, ADD updated_at DATETIME NOT NULL, ADD deleted_at DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C84955DE12AB56 FOREIGN KEY (created_by) REFERENCES fos_user (id)');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C8495516FE72E1 FOREIGN KEY (updated_by) REFERENCES fos_user (id)');
        $this->addSql('CREATE INDEX IDX_42C84955DE12AB56 ON reservation (created_by)');
        $this->addSql('CREATE INDEX IDX_42C8495516FE72E1 ON reservation (updated_by)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE reservation DROP FOREIGN KEY FK_42C84955DE12AB56');
        $this->addSql('ALTER TABLE reservation DROP FOREIGN KEY FK_42C8495516FE72E1');
        $this->addSql('DROP INDEX IDX_42C84955DE12AB56 ON reservation');
        $this->addSql('DROP INDEX IDX_42C8495516FE72E1 ON reservation');
        $this->addSql('ALTER TABLE reservation DROP created_by, DROP updated_by, DROP created_at, DROP updated_at, DROP deleted_at');
    }
}
