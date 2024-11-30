// Entry point for server
import app from "./app";
import { ENV } from "./config/environment";

const PORT = ENV.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
