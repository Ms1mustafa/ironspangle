import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";
import { useLocation, Link } from "react-router-dom";
import Input from "../components/Input";
import AuthCheck from "../API/account/AuthCheck";
import { Children, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { useNavigate } from "react-router-dom";

// Define navigation items with routes
const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Projects", href: "/projects" },
  //expenses: company, Lafarge, ppe, sd
  { name: "Company Expenses", href: "/expenses/company" },
  { name: "Lafarge expenses", href: "/expenses/lafarge" },
  { name: "PPE expenses", href: "/expenses/ppe" },
  { name: "SD expenses", href: "/expenses/sd" },
  // contracts: summary, employee company, admin, mec, supplay chain
  { name: "Summary", href: "/summary" },
  { name: "Employee company", href: "/employee_company" },
  { name: "Admin", href: "/admin" },
  { name: "Mec", href: "/mec" },
  { name: "Supply chain", href: "/supply_chain" },
  // accounting: po, swift, received at bank
  { name: "PO", href: "/po" },
  { name: "Swift", href: "/swift" },
  { name: "Received at bank", href: "/received_at_bank" },
];

// Function to get a formatted display name from the path segment
function getDisplayName(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0) {
    const firstSegment = segments[0];
    return firstSegment
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
  }
  return "Dashboard"; // Default name if no segments
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation(); // Get current location
  const currentPath = location.pathname; // Get current path
  const firstSegment = getDisplayName(currentPath); // Get the formatted first segment
  const user = AuthCheck();

  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  // Filter suggestions based on input
  const searchSuggestion = (event) => {
    let query = event.query.toLowerCase();
    let filteredSuggestions = navigation.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
    setSuggestions(filteredSuggestions);
  };

  // Handle suggestion selection and navigate
  const handleSelect = (e) => {
    const selectedItem = e.value;
    if (selectedItem && selectedItem.href) {
      console.log("Navigating to:", selectedItem.href); // Debugging line
      navigate(selectedItem.href);
      setValue("");
    }
  };

  return (
    <Disclosure as="nav" className="bg-transparent">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Left side: Dynamic text and search box */}
          <div className="flex items-center space-x-4">
            <span className="text-xl font-medium">{firstSegment}</span>
            {/* Search box */}
            <div className="flex-grow">
              <AutoComplete
                value={value}
                suggestions={suggestions}
                completeMethod={searchSuggestion}
                onChange={(e) => setValue(e.value)}
                onSelect={handleSelect}
                field="name" // Ensure this matches the property in suggestions
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Right side: Avatar and Username */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Menu as="div" className="relative">
              <div>
                <MenuButton className="flex items-center space-x-2 rounded-full focus:outline-none">
                  <img
                    alt="User Avatar"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="hidden sm:inline ml-2">
                    {user?.data.name}
                  </span>
                </MenuButton>
              </div>
              {/* Uncomment and configure the menu if needed */}
              {/* <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <Link
                    to="/profile"
                    className="menuItem-link"
                  >
                    Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to="/signout"
                    className="menuItem-link"
                  >
                    Sign out
                  </Link>
                </MenuItem>
              </MenuItems> */}
            </Menu>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link} // Change from 'a' to 'Link' for React Router integration
              to={item.href}
              aria-current={item.href === currentPath ? "page" : undefined}
              className={classNames(
                item.href === currentPath
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
