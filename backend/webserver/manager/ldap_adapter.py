import logging

from ldap3 import Server, ALL, Connection

logger = logging.getLogger(__name__)

class LdapAdapter:

    def __init__(
            self,
            host: str,
            admin_dn: str,
            admin_password: str,
            user_base_dn: str,
            user_search_filter: str
            ):

        self._host = host
        self._admin_dn = admin_dn
        self._admin_password = admin_password
        self._user_base_dn = user_base_dn
        self._user_search_filter = user_search_filter

    def get_ldap_user(self, username:str):
        search_filter = self._user_search_filter.replace("VALUE", username)
        return search_filter

    def admin_login(self) -> Connection:
        logger.info(f"Using LDAP server {self._host}")
        server = Server(self._host, get_info=ALL)
        connection = Connection(server, user=self._admin_dn, password=self._admin_password, read_only=True)

        if not connection.bind():
            logger.error(f"Admin login not successful!")

        return connection

    def authenticate_user(self, connection: Connection, username: str, password: str):

        search_filter = self.get_ldap_user(username)

        connection.search(search_base=self._user_base_dn,
                          search_filter=search_filter,
                          attributes=["memberOf"])

        if len(connection.entries) == 0:
            logger.warning(f"Search '{search_filter}' returned empty set!")
            return None

        if len(connection.entries) > 1:
            logger.warning(f"Multiple entries with the same identifier: {username} detected.")
            return None

        groups = connection.entries[0].memberOf.values

        user_dn = connection.entries[0].entry_dn

        server = Server(self._host, get_info=ALL)
        connection = Connection(server, user=user_dn, password=password, read_only=True)

        if not connection.bind():
            logger.warning(f"Cannot bind to {user_dn} for {username}!")
            return None

        return groups
