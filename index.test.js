const sphinx = require('./index');

test('', () => {
    const args = sphinx.buildOptions('', '', {})
    expect(args.length).toBe(0);
});

test('forceAll option', () => {
    const args = sphinx.buildOptions('', '', {forceAll: true})
    expect(args).toEqual(['-a']);
});

test('builder option', () => {
    const args = sphinx.buildOptions('', '', {builder: 'xml'})
    expect(args).toEqual(['-b', 'xml']);
});

test('freshEnv option', () => {
    const args = sphinx.buildOptions('', '', {freshEnv: true});
    expect(args).toEqual(['-E']);
});

test('doctreeDir option', () => {
    const args = sphinx.buildOptions('', '', {doctreeDir: 'my-doctree-dir'});
    expect(args).toEqual(['-d', 'my-doctree-dir']);
});

test('jobs option', () => {
    const args = sphinx.buildOptions('', '', {jobs: 4});
    expect(args).toEqual(['-j', '4']);
});

test('confDir option', () => {
    const args = sphinx.buildOptions('', '', {confDir: 'my-conf-dir'});
    expect(args).toEqual(['-c', 'my-conf-dir']);
});

test('noConfig option', () => {
    const args = sphinx.buildOptions('', '', {noConfig: true});
    expect(args).toEqual(['-C']);
});


test('defineSettings option', () => {
    const args = sphinx.buildOptions('', '', {defineSettings: {foo: 'bar'}});
    expect(args).toEqual(['-D', 'foo=bar']);
});

