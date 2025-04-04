using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WaterProject.API.Migrations
{
    /// <inheritdoc />
    public partial class RecreateBookTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BookId",
                table: "Books",
                newName: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Books",
                newName: "BookId");
        }
    }
}
