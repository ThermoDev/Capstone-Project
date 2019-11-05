from typing import Iterable, Optional


class BaseRepository:
    def build_select_all_query(self, table: str, identifiers: Optional[Iterable[str]] = None) -> str:
        query_string = f'SELECT * from {table}\n'
        if identifiers:
            query_string += self._build_identifiers_clause(identifiers)

        return query_string

    def build_insert_query(self, table: str, columns: Iterable[str]) -> str:
        columns_string = ''
        values_string = ''
        for index, column in enumerate(columns):
            if index == 0:
                columns_string += f'{column}'
                values_string += '?'
            else:
                columns_string += f', {column}'
                values_string += ', ?'

        query_string = (f'INSERT into {table} ({columns_string})\n'
                        f'VALUES ({values_string})')

        return query_string

    def build_replace_query(self, table: str, columns: Iterable[str]) -> str:
        columns_string = ''
        values_string = ''
        for index, column in enumerate(columns):
            if index == 0:
                columns_string += f'{column}'
                values_string += '?'
            else:
                columns_string += f', {column}'
                values_string += ', ?'

        query_string = (f'REPLACE into {table} ({columns_string})\n'
                        f'VALUES ({values_string})')

        return query_string

    def _build_identifiers_clause(self, identifiers: Optional[Iterable[str]] = None) -> str:
        clause = 'WHERE '
        for index, identifier in enumerate(identifiers):
            if index == 0:
                clause += f'{identifier}=?'
            else:
                clause += f' AND {identifier}=?'

        return clause
