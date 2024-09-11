import { getAllPermissionByRoleId, updatePermission } from "@/apis/permission";
import { CustomSheet } from "@/components/common/custom-sheet";
import { useCustomToast } from "@/components/common/custom-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/common/ui/accordion";
import { Button } from "@/components/common/ui/button";
import { Checkbox } from "@/components/common/ui/checkbox";
import useFetchData from "@/hooks/useRefetchData";
import { useToggle } from "@/hooks/useToggle";
import { useEffect, useState } from "react";

export function DetailPermission({ onOpenChange, role = {}, revalidate }) {
  const toast = useCustomToast();
  const [btnLoading, setBtnLoading] = useToggle();
  const { data: permissions } = useFetchData({
    service: getAllPermissionByRoleId,
    params: { roleId: role.ID },
    dependencies: [role.ID],
    shouldFetch: !!role.ID
  });
  const [permissionData, setPermissionData] = useState(permissions ?? []);

  useEffect(() => {
    if (permissions) {
      setPermissionData(permissions);
    }
  }, [permissions, role.ID]);

  const handleCheckboxChange = (parentIndex, childIndex, field, checked) => {
    setPermissionData(prevState => {
      let newState = [...prevState];
      newState[parentIndex].child[childIndex][field] = checked;
      return newState;
    });
  };

  const handlerUpdatePermission = () => {
    setBtnLoading(true);
    let data = [];
    permissionData.forEach(menu => {
      menu.child.forEach(submenu => {
        console.log(submenu);
        data.push({
          ROWGUID: submenu.ROWGUID,
          ROLE_ID: role.ID,
          MENU_ID: submenu.MENU_ID,
          CAN_VIEW: submenu.CAN_VIEW,
          CAN_ADD_NEW: submenu.CAN_ADD_NEW,
          CAN_MODIFY: submenu.CAN_MODIFY,
          CAN_DELETE: submenu.CAN_DELETE
        });
      });
    });
    updatePermission({ data: data })
      .then(res => {
        toast.success(res);
        setBtnLoading(false);
        onOpenChange();
        revalidate();
      })
      .catch(err => {
        toast.error(err.message);
        setBtnLoading(false);
      });
  };

  return (
    <CustomSheet open={!!role.ID} onOpenChange={onOpenChange} title="Phân quyền cho người dùng">
      <div className="mt-4 flex w-fit flex-row justify-center gap-2 self-center rounded-sm border bg-slate-100 px-6 py-1">
        <p className="text-16 text-gray-900">Chức vụ:</p>
        <p className="text-16 font-semibold text-gray-900">{role?.NAME}</p>
      </div>
      <CustomSheet.Content title="Phân quyền" className="flex flex-col overflow-hidden">
        <Accordion type="multiple" className="h-full w-full overflow-auto px-2">
          {permissionData?.map((menu, parentIndex) => {
            console.log(menu);
            if (menu.child?.length === 0) return null;
            return (
              <AccordionItem value={menu.MENU_ID} className="border-none" key={parentIndex}>
                <AccordionTrigger className="justify-normal">
                  <li className="mr-2 text-sm font-bold">{menu.MENU_NAME}</li>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-6 border-b bg-blue-50 px-2 py-3 text-sm font-medium text-blue-700">
                    <div className="col-span-2">Loại quyền</div>
                    <div className="text-center">Xem</div>
                    <div className="text-center">Thêm</div>
                    <div className="text-center">Sửa</div>
                    <div className="text-center">Xóa</div>
                  </div>
                  {menu.child?.map((submenu, childIndex) => {
                    let disabled = false;
                    if (submenu.PARENT_ID === "user-management" && submenu.ROLE_ID === "admin") {
                      disabled = true;
                    }
                    return (
                      <div key={submenu.ROWGUID} className="grid grid-cols-6 border-b px-2 py-3">
                        <div className="col-span-2">{submenu.MENU_NAME}</div>
                        <Checkbox
                          disabled={disabled}
                          className="self-center justify-self-center border-blue-600 data-[state=checked]:bg-blue-600"
                          defaultChecked={submenu.CAN_VIEW}
                          checked={permissionData[parentIndex].child[childIndex].CAN_VIEW}
                          onCheckedChange={checked => {
                            handleCheckboxChange(parentIndex, childIndex, "CAN_VIEW", checked);
                          }}
                        />
                        <Checkbox
                          disabled={disabled}
                          className="self-center justify-self-center border-blue-600 data-[state=checked]:bg-blue-600"
                          defaultChecked={submenu.CAN_ADD_NEW}
                          checked={permissionData[parentIndex].child[childIndex].CAN_ADD_NEW}
                          onCheckedChange={checked => {
                            handleCheckboxChange(parentIndex, childIndex, "CAN_ADD_NEW", checked);
                          }}
                        />
                        <Checkbox
                          disabled={disabled}
                          className="self-center justify-self-center border-blue-600 data-[state=checked]:bg-blue-600"
                          defaultChecked={submenu.CAN_MODIFY}
                          checked={permissionData[parentIndex].child[childIndex].CAN_MODIFY}
                          onCheckedChange={checked => {
                            handleCheckboxChange(parentIndex, childIndex, "CAN_MODIFY", checked);
                          }}
                        />
                        <Checkbox
                          disabled={disabled}
                          className="self-center justify-self-center border-blue-600 data-[state=checked]:bg-blue-600"
                          defaultChecked={submenu.CAN_DELETE}
                          checked={permissionData[parentIndex].child[childIndex].CAN_DELETE}
                          onCheckedChange={checked => {
                            handleCheckboxChange(parentIndex, childIndex, "CAN_DELETE", checked);
                          }}
                        />
                      </div>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CustomSheet.Content>
      <CustomSheet.Footer className="flex flex-row justify-end gap-2.5 px-6 py-4 ">
        <Button onClick={onOpenChange} className="h-[36px] w-[126px]" variant="outline">
          Hủy
        </Button>
        <Button
          loading={btnLoading}
          onClick={() => {
            handlerUpdatePermission();
          }}
          className="h-[36px] w-[126px]"
          variant="blue"
        >
          Lưu thông tin
        </Button>
      </CustomSheet.Footer>
    </CustomSheet>
  );
}
