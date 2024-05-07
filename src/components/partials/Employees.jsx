import { useEffect, useState } from "react";
import qs from "qs";
import { Button, Modal, Switch } from "antd";
import UserModal from "../features/modals/UserModal";
import UserEditModal from "../features/modals/UserEditModal";
import Loading from "../common/Loading";
import { toast } from "react-toastify";

const urlParamsObject = {
  populate: {
    role: {
      populate: "*",
    },
    avatar: {
      populate: "*",
    },
    background: {
      populate: "*",
    },
    brand: {
      populate: "*",
    },
    serviceOrderRequestIDs: {
      populate: "*",
    },
    attachedFile: {
      populate: "*",
    },
  },
};

const Employees = ({ apiUrl, apiToken }) => {
  const [users, setUsers] = useState();
  const [roles, setRoles] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [openUserEdit, setOpenUserEdit] = useState(false);
  const [openUserDelete, setOpenUserDelete] = useState(false);

  useEffect(() => {
    getUsers();
    getRoles();
  }, []);

  const getUsers = async () => {
    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${apiUrl}/api/users?${queryString}`;

    try {
      const response = await fetch(requestUrl);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getRoles = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/users-permissions/roles`);
      const data = await response.json();
      setRoles(data?.roles);
    } catch (error) {
      console.error(error);
    }
  };

  const clearAllData = () => {
    setOpenAddUserModal(false);
  };

  const handleApproveEmployee = (user, checked) => {
    console.log(user, checked, "Hello");
  };

  const handleDeleteUser = async (user) => {
    setLoading(true);

    const response = await fetch(`${apiUrl}/api/users/${user?.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`, // Replace with your Strapi JWT token
      },
    });

    if (response.ok) {
      setTimeout(() => {
        setLoading(false);
        setOpenUserDelete(false);
      }, 1500);

      toast.success("👌 User deleted successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      console.error("Error deleting user");
      setTimeout(() => {
        setLoading(false);
        setOpenUserDelete(false);
      }, 1500);

      toast.error("Error deleting user!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  console.log(users, "usersusers");

  return (
    <>
      {loading && <Loading />}

      <div className="block overflow-hidden shadow">
        <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700">
          <div className="w-full mb-1">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                All Employees
              </h1>
            </div>

            <div className="sm:flex">
              <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
                <form className="lg:pr-3" action="#" method="GET">
                  <label htmlFor="users-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative mt-1 lg:w-64 xl:w-96">
                    <input
                      type="text"
                      name="email"
                      id="users-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Search for users"
                    />
                  </div>
                </form>
              </div>

              <div className="flex items-center rtl:ml-0 rtl:mr-auto ml-auto space-x-2 sm:space-x-3">
                <Button
                  type="primary"
                  onClick={() => setOpenAddUserModal(true)}
                  className="inline-flex items-center justify-center px-3 py-3 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  <svg
                    className="w-5 h-5 mr-2 -ml-1 rtl:ml-2 rtl:-mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Add user
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      {/* <th className="p-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-all"
                            aria-describedby="checkbox-1"
                            type="checkbox"
                            className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label htmlFor="checkbox-all" className="sr-only">
                            checkbox
                          </label>
                        </div>
                      </th> */}
                      <th className="p-4 text-xs font-medium text-left rtl:text-right text-gray-500 uppercase dark:text-gray-400">
                        UserName
                      </th>
                      <th className="p-4 text-xs font-medium text-left rtl:text-right text-gray-500 uppercase dark:text-gray-400">
                        Mobile Number
                      </th>
                      <th className="p-4 text-xs font-medium text-left rtl:text-right text-gray-500 uppercase dark:text-gray-400">
                        Company Name
                      </th>
                      <th className="p-4 text-xs font-medium text-left rtl:text-right text-gray-500 uppercase dark:text-gray-400">
                        Address
                      </th>
                      <th className="p-4 text-xs font-medium text-left rtl:text-right text-gray-500 uppercase dark:text-gray-400">
                        Roles
                      </th>
                      <th className="p-4 text-xs font-medium text-left rtl:text-right text-gray-500 uppercase dark:text-gray-400">
                        User Status
                      </th>
                      <th className="p-4 text-xs font-medium text-left rtl:text-right text-gray-500 uppercase dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {users
                      ?.filter((item) => item.isEmployee)
                      ?.map((user, index) => (
                        <tr
                          className="hover:bg-gray-100 dark:hover:bg-gray-700"
                          key={index}
                        >
                          {/* <td className="w-4 p-4">
                          <div className="flex items-center">
                            <input
                              id="checkbox-{{ .id }}"
                              aria-describedby="checkbox-1"
                              type="checkbox"
                              className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              htmlFor="checkbox-{{ .id }}"
                              className="sr-only"
                            >
                              checkbox
                            </label>
                          </div>
                        </td> */}
                          <td className="flex items-center p-4 mr-12 rtl:mr-0 rtl:ml-0 whitespace-nowrap">
                            {user?.avatar ? (
                              <img
                                className="w-10 h-10 rounded-full rtl:ml-6"
                                src={user?.avatar?.url}
                                alt={`avatar`}
                              />
                            ) : (
                              <div className="flex items-center justify-center font-semibold text-xl w-10 h-10 rounded-full rtl:ml-6 bg-gray-200">
                                {user?.username?.charAt(0)}
                              </div>
                            )}

                            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                              <div className="text-base font-semibold text-gray-900 dark:text-white">
                                {user?.username}
                              </div>
                              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                {user?.email}
                              </div>
                            </div>
                          </td>

                          <td className="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                            {user?.mobileNumber}
                          </td>

                          <td className="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                            {user?.companyName}
                          </td>

                          <td className="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                            {user?.address}
                          </td>

                          <td className="max-w-sm p-4 font-semibold overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                            {user?.role?.name}
                          </td>

                          <td className="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
                            <div className="flex items-center">
                              <Switch
                                checked={user?.approvedAsEmployee}
                                onChange={(checked) =>
                                  handleApproveEmployee(user, checked)
                                }
                              />

                              <span
                                className={` mr-3 ${
                                  user?.approvedAsEmployee
                                    ? "font-semibold"
                                    : "text-gray-500"
                                }`}
                              >
                                {user?.approvedAsEmployee
                                  ? "Approved"
                                  : "Not Approved"}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 space-x-2 whitespace-nowrap">
                            <Button
                              type="primary"
                              onClick={() => {
                                setOpenUserEdit(true);
                                setSelectedUser(user);
                              }}
                              className="ml-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                              <svg
                                className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <>
                                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                    clipRule="evenodd"
                                  />
                                </>
                              </svg>
                              Edit user
                            </Button>
                            <Button
                              onClick={() => {
                                setOpenUserDelete(true);
                                setSelectedUser(user);
                              }}
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center !text-white !border-red-600 bg-red-600 rounded-lg hover:!bg-red-800 focus:!ring-4 focus:!ring-red-300 dark:focus:!ring-red-900"
                            >
                              <svg
                                className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Delete user
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        centered
        open={openAddUserModal}
        onCancel={() => {
          clearAllData();
        }}
        width={500}
        footer={null}
      >
        <UserModal
          roles={roles}
          apiUrl={apiUrl}
          setLoading={setLoading}
          apiToken={apiToken}
          setOpenAddUserModal={setOpenAddUserModal}
        />
      </Modal>

      <Modal
        centered
        open={openUserEdit}
        onCancel={() => {
          setOpenUserEdit(false);
        }}
        width={500}
        footer={null}
      >
        <UserEditModal
          users={users}
          setUsers={setUsers}
          selectedUser={selectedUser}
          setLoading={setLoading}
          roles={roles}
          apiUrl={apiUrl}
          apiToken={apiToken}
          setOpenUserEdit={setOpenUserEdit}
        />
      </Modal>

      <Modal
        centered
        open={openUserDelete}
        onCancel={() => {
          setOpenUserDelete(false);
        }}
        width={300}
        footer={null}
      >
        <h3 className="text-2xl font-semibold mb-6 text-center">
          Are u sure?
        </h3>

        <div className="flex items-center justify-center">
          <Button type="primary" onClick={() => handleDeleteUser(selectedUser)}>
            OK
          </Button>
          <Button className="mr-2" onClick={() => setOpenUserDelete(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Employees;
