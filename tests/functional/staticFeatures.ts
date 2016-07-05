import * as assert from 'intern/chai!assert';
import * as registerSuite from 'intern!object';
import * as Suite from 'intern/lib/Suite';
import * as Command from 'leadfoot/Command';
import * as pollUntil from 'leadfoot/helpers/pollUntil';

declare global {
	interface Window {
		hasTestResults: any;
	}
}

function executeTest(suite: Suite, htmlTestPath: string, testFn: (result: any) => void, timeout = 5000): Command<any> {
	return suite.remote
		.get(require.toUrl(htmlTestPath))
		.then(pollUntil(function() {
			const results = window.hasTestResults;
			if (results) {
				if (typeof window.DojoHasEnvironment === 'undefined') {
					return results;
				}
				else {
					throw new Error('DojoHasEnvironment not unset');
				}
			}
		}, null, timeout))
		.then(testFn, function() {
			throw new Error('loaderTestResult was not set.');
		});
}

registerSuite({
	name: 'staticFeatures',

	'provided as an object'() {
		return executeTest(this, './staticFeaturesObject.html', function(results: any) {
			assert.deepEqual(results, { foo: 1, bar: 'bar', baz: false }, 'Results should be the asserted static features');
		});
	},

	'provided as a function'() {
		return executeTest(this, './staticFeaturesFunction.html', function(results: any) {
			assert.deepEqual(results, { foo: 1, bar: 'bar', baz: false }, 'Results should be the asserted static features');
		});
	}
});
