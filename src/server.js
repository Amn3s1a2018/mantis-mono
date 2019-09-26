import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import apimw from './apimw.js';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const app=polka()
app.my_id='123'
app
	.use( compression({ threshold: 0 }) )
	.use('/e', apimw)
	.use(
		sirv('static', { dev })
,		sapper.middleware( {ignore: '/e'} )
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});

