from stone.backends import tsd_client
from stone.backends.tsd_helpers import fmt_error_type, fmt_func, fmt_type
from stone.ir import Void


class DropboxTSDClientBackend(tsd_client.TSDClientBackend):
    """Generate SDK client declarations with download body types."""

    def _generate_route(self, namespace, route):
        function_name = fmt_func(namespace.name + '_' + route.name, route.version)
        self.emit()
        self.emit('/**')
        if route.doc:
            self.emit_wrapped_text(self.process_doc(route.doc, self._docf), prefix=' * ')
            self.emit(' *')

        attrs_lines = []
        if self.args.attribute_comment and route.attrs:
            for attribute in self.args.attribute_comment:
                if attribute in route.attrs and route.attrs[attribute] is not None:
                    attrs_lines.append(' *   {}: {}'.format(attribute, route.attrs[attribute]))
        if attrs_lines:
            self.emit(' * Route attributes:')
            for attr_line in attrs_lines:
                self.emit(attr_line)
            self.emit(' *')

        self.emit_wrapped_text(
            'When an error occurs, the route rejects the promise with type {}.'.format(
                fmt_error_type(
                    route.error_data_type,
                    wrap_error_in=self.args.wrap_error_in,
                )
            ),
            prefix=' * ',
        )
        if route.deprecated:
            self.emit(' * @deprecated')

        if route.arg_data_type.__class__ != Void:
            self.emit(' * @param arg The request parameters.')
        self.emit(' */')

        result_type = fmt_type(route.result_data_type)
        if route.attrs.get('style') == 'download':
            result_type = 'DropboxDownloadResult<{}>'.format(result_type)

        if self.args.wrap_response_in:
            return_type = 'Promise<{}<{}>>;'.format(
                self.args.wrap_response_in,
                result_type,
            )
        else:
            return_type = 'Promise<{}>;'.format(result_type)

        arg = ''
        if route.arg_data_type.__class__ != Void:
            arg = 'arg: {}'.format(fmt_type(route.arg_data_type))

        self.emit('public {}({}): {}'.format(function_name, arg, return_type))
