'use strict';

angular.module('o19s.splainer-search')
    .service('trieveSearcherPreprocessorSvc', [
        'queryTemplateSvc',
        'defaultTrieveConfig',
        function trieveSearcherPreprocessorSvc(queryTemplateSvc, defaultTrieveConfig) {
            const self = this;

            // Functions
            self.prepare  = prepare;

            const replaceQuery = function(qOption, args, queryText) {
                return queryTemplateSvc.hydrate(args, queryText, {qOption: qOption, encodeURI: false, defaultKw: '\\"\\"'});
            };

            var preparePostRequest = function (searcher) {
                var pagerArgs = angular.copy(searcher.args.pager);
                if ( angular.isUndefined(pagerArgs) || pagerArgs === null ) {
                    pagerArgs = {};
                }

                var defaultPagerArgs = {};

                searcher.pagerArgs  = angular.merge({}, defaultPagerArgs, pagerArgs);
                delete searcher.args.pager;

                var queryDsl    = replaceQuery(searcher.config.qOption, searcher.args, searcher.queryText);

                searcher.queryDsl   = queryDsl;
            };

            function prepare (searcher) {
                if (searcher.config === undefined) {
                    searcher.config = defaultTrieveConfig;
                } else {
                    // make sure config params that weren't passed through are set from
                    // the default config object.
                    searcher.config = angular.merge({}, defaultTrieveConfig, searcher.config);
                }

                preparePostRequest(searcher);
            }
        }
    ]);
