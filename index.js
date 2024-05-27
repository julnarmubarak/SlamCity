require('dotenv').config();
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());


const userRoutes = require('./routes/user_routes');
app.use('/user', userRoutes);


const candidate_routes = require('./routes/candidate_routes');
app.use('/candidate', candidate_routes);

const commentsRoutes = require('./routes/comments_routes');
app.use('/comments', commentsRoutes);


const e_walletRoutes = require('./routes/e_wallet_routes');
app.use('/e_wallet', e_walletRoutes);


const match_detailsRoutes = require('./routes/match_details_routes');
app.use('/match_details', match_detailsRoutes);


const match_locationRoutes = require('./routes/match_location_routes');
app.use('/match_location', match_locationRoutes);


const playersRoutes = require('./routes/players_routes');
app.use('/players', playersRoutes);


const ratingRoutes = require('./routes/rating_routes');
app.use('/rating', ratingRoutes);


const roleRoutes = require('./routes/role_routes');
app.use('/role', roleRoutes);


const teamsRoutes = require('./routes/teams_routes');
app.use('/teams', teamsRoutes);


const ticketRoutes = require('./routes/ticket_routes');
app.use('/ticket', ticketRoutes);




const votingRoutes = require('./routes/voting_routes');
app.use('/voting', votingRoutes);


const cityRoutes = require('./routes/city_routes');
app.use('/city', cityRoutes);


const player_statisticsRoutes = require('./routes/player_statistics_routes');
app.use('/player_statistics', player_statisticsRoutes);


const statistics_typeRoutes = require('./routes/statistics_type_routes');
app.use('/statistics_type', statistics_typeRoutes);


const leaguesRoutes = require('./routes/leagues_routes');
app.use('/leagues', leaguesRoutes);


const teams_leaguesRoutes = require('./routes/teams_leagues_routes');
app.use('/teams_leagues', teams_leaguesRoutes);







const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
