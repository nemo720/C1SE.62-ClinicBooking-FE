import React, { useState } from "react";
import { useGetListDepartment } from "../../hook/useGetListDepartment";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import { apiFetch } from "../../lib/apiFetch";

function Appoiments() {
  const { data, refetch } = useGetListDepartment();
  const { enqueueSnackbar } = useSnackbar();

  const [isUpdate, setIsUpdate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const handleAddClick = () => {
    setValues({
      name: "",
    });
    setIsUpdate(false);
  };

  const handleEditClick = (patient) => {
    setIsUpdate(true);
    setValues(patient);
  };

  const handleCloseModal = () => {
    setIsUpdate(null);
  };

  const handleRegister = async (value) => {
    try {
      setIsLoading(true);
      const { data, status } = await apiFetch("/departments", {
        method: "POST",
        body: JSON.stringify(value),
      });
      if (!status) {
    
        throw new Error(data);
      }
      enqueueSnackbar("Đăng kí thành công", { variant: "success" });
      refetch();
      setIsUpdate(null);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (value) => {
    try {
      setIsLoading(true);
      const { data, status } = await apiFetch(
        "/departments/" + values.departmentId,
        {
          method: "PUT",
          body: JSON.stringify(value),
        }
      );
      if (!status) {
        const message = Object.entries(data)[0][1];
        throw new Error(message);
      }
      enqueueSnackbar("Cập nhật thành công", { variant: "success" });
      refetch();
      setIsUpdate(null);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      const { data, status } = await apiFetch("/departments/" + id, {
        method: "DELETE",
      });
      if (!status) {
        throw new Error(data);
      }
      enqueueSnackbar("Xóa thành công", { variant: "success" });
      refetch();
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const { values, handleChange, handleSubmit, setValues } = useFormik({
    initialValues: {
      departmentId: 0,
      name: "",
    },
    onSubmit: !isUpdate ? handleRegister : handleUpdate,
  });

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-7 col-auto">
                <h3 className="page-title">Chuyên Khoa</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="index.html">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item active">Chuyên Khoa</li>
                </ul>
              </div>
              <div className="col-sm-5 col">
                <button
                  onClick={handleAddClick}
                  className="btn btn-primary float-right mt-2"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="datatable table table-hover table-center mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Chuyên Khoa</th>
                          <th>Số bác sĩ</th>
                          <th className="text-right">Hành Động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data &&
                          data.map((e, index) => (
                            <tr key={index}>
                              <td>{e.departmentId}</td>
                              <td>{e.name}</td>
                              <td>{e.doctorCount} Bác sĩ</td>
                              <td className="text-right">
                                <button
                                  onClick={() => handleEditClick(e)}
                                  className="btn btn-sm btn-info"
                                >
                                  Sửa
                                </button>
                                <button
                                  data-toggle="modal"
                                  onClick={() => {
                                    setDeleteId(e.departmentId);
                                  }}
                                  className="btn btn-sm btn-danger"
                                >
                                  Xóa
                                </button>
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
        </div>
      </div>
      {/* /Page Wrapper */}

      {/* Add Modal */}
      {isUpdate !== null && !isUpdate && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          aria-hidden="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thêm Chuyên Khoa</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row form-row">
                    <div className="col-12 col-sm-12">
                      <div className="form-group">
                        <label>Chuyên Khoa</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    Lưu Thay Đổi
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* /Add Modal */}

      {/* Edit Details Modal */}
      {isUpdate !== null && isUpdate && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          aria-hidden="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chỉnh Sửa Chuyên Khoa</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row form-row">
                    <div className="col-12 col-sm-12">
                      <div className="form-group">
                        <label>Chuyên Khoa</label>
                        <input
                          type="text"
                          className="form-control"
                          value={values.name}
                          name="name"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    Lưu Thay Đổi
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* /Edit Details Modal */}

      {/* Delete Modal */}
      {deleteId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-content p-2">
                  <h4 className="modal-title">Xóa</h4>
                  <p className="mb-4">Bạn có chắc chắn muốn xóa không?</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={(e) => {
                      handleDelete(deleteId);
                      setDeleteId(null);
                    }}
                  >
                    Đồng ý
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-dismiss="modal"
                    onClick={() => {
                      setDeleteId(null);
                    }}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* /Delete Modal */}
    </>
  );
}

export default Appoiments;
