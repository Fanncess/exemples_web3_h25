import { BrowserRouter, Route, Routes } from "react-router";
import { BarreNavigation } from "~/components/BarreNavigation";
import { Accueil } from "~/pages/Accueil";
import { PageGet } from "~/pages/PageGet";
import { PagePost } from "~/pages/PagePost";

export function App() {
  return (
    <BrowserRouter>
      <BarreNavigation />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/fetch">
          <Route path="get" element={<PageGet />}>
            <Route path=":postId" element={<PageGet />} />
          </Route>
          <Route path="post" element={<PagePost />} />
        </Route>
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
