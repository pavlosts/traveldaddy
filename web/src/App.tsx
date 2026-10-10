import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom"
import { ReviewDirections } from "@/pages/ReviewDirections"
import { ReviewLensIcons } from "@/pages/ReviewLensIcons"
import { ReviewMotion } from "@/pages/ReviewMotion"
import { DigestProvider } from "@/prototype/DigestContext"
import { DirectoryPage } from "@/prototype/DirectoryPage"
import { LocationPage } from "@/prototype/LocationPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <DigestProvider>
              <Outlet />
            </DigestProvider>
          }
        >
          <Route path="/" element={<DirectoryPage />} />
          <Route path="/place/:cityId" element={<LocationPage />} />
        </Route>
        <Route path="/review" element={<ReviewDirections />} />
        <Route path="/review/lens-icons" element={<ReviewLensIcons />} />
        <Route path="/review/motion" element={<ReviewMotion />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
