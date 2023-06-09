import { Base, FieldSet, Table } from 'airtable';

const Airtable = require('airtable');

const BOOKS_TITLE = 'Books';
const BORROW_MAP_TITLE = 'BorrowMap';

export default class AirtableMiddleware {

	private booksTable!: Table<FieldSet>;
	private borrowTable!: Table<FieldSet>;

	readBase: Base;
	writeBase: Base;

	constructor() {
		this.readBase = new Airtable({
			apiKey: process.env.VUE_APP_ARTBL_TOKEN__BOOKS
		})
			.base(process.env.VUE_APP_ARTBL_BASE__BOOKS);

		this.writeBase = new Airtable({
			apiKey: process.env.VUE_APP_ARTBL_TOKEN__BORROWED
		})
			.base(process.env.VUE_APP_ARTBL_BASE__BORROWED);
	}

	getAllBooks = async () => {
		if (!this.booksTable) {
			this.booksTable = await this.readBase(BOOKS_TITLE);
		}
		return this.booksTable
			.select({
				// maxRecords: 20,
				view: BOOKS_TITLE,
				sort: [
					{
						field: 'title',
						direction: 'asc'
					},
					{
						field: 'series',
						direction: 'asc'
					},
					{
						field: 'author',
						direction: 'asc'
					},
					{
						field: 'book_id',
						direction: 'asc'
					}
				]
			})
			.all();
	};

	borrowBook = async (bookId: string, username: string, bookRef: string) => {
		const writeBorrowTable = await this.writeBase(BORROW_MAP_TITLE);
		const writeBookTable = await this.writeBase(BOOKS_TITLE);

		return await Promise.all([
			writeBorrowTable.create([
				{
					fields: {
						book_id: bookId,
						username: username
					}
				}
			]),
			writeBookTable.update([
				{
					id: bookRef,
					fields: {
						borrowed: new Date().toISOString().split('T')[0]
					}
				}
			])
		]);
	};

	returnBook = async (bookId: string, username: string, bookRef: string) => {
		const writeBookTable = await this.writeBase(BOOKS_TITLE);
		const writeBorrowedTable = await this.writeBase(BORROW_MAP_TITLE);
		const readBorrowedTable = await this.readBase(BORROW_MAP_TITLE);

		const borrowed = await readBorrowedTable
			.select({
				// maxRecords: 20,
				view: "Mappings",
			})
			.all();
		const matches = borrowed
			.filter(record => {
				return record.fields.book_id === bookId && record.fields.username === username;
			})

		if (matches.length < 1) {
			return {}
		}

		return await Promise.all([
			...matches.map(async (borrowedBook) => {
				return await writeBorrowedTable.destroy(borrowedBook.id)
			}),
			writeBookTable.update([
				{
					id: bookRef,
					fields: {
						borrowed: ''
					}
				}
			])
		]);
	};

}
