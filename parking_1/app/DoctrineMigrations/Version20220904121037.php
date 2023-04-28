<?php declare(strict_types=1);

namespace Application\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220904121037 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE reservation ADD parking INT NOT NULL, ADD first_name VARCHAR(200) DEFAULT NULL, ADD last_name VARCHAR(200) DEFAULT NULL, ADD email VARCHAR(200) DEFAULT NULL, ADD type_vechile VARCHAR(200) DEFAULT NULL, ADD date DATETIME DEFAULT NULL, ADD time DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C84955B237527A FOREIGN KEY (parking) REFERENCES parking (id)');
        $this->addSql('CREATE INDEX IDX_42C84955B237527A ON reservation (parking)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE reservation DROP FOREIGN KEY FK_42C84955B237527A');
        $this->addSql('DROP INDEX IDX_42C84955B237527A ON reservation');
        $this->addSql('ALTER TABLE reservation DROP parking, DROP first_name, DROP last_name, DROP email, DROP type_vechile, DROP date, DROP time');
    }
}
