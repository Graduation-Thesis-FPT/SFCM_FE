import { getAllPermissionByRoleCode, updatePermission } from "@/apis/permission";
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
import { ScrollArea } from "@/components/common/ui/scroll-area";
import { Separator } from "@/components/common/ui/separator";
import { useEffect, useState } from "react";

export function DetailPermission({ onOpenChange, detailData }) {
  const toast = useCustomToast();
  const [permissionData, setPermissionData] = useState([]);

  const handlerUpdatePermission = () => {
    let data = [];
    permissionData.forEach(parent => {
      parent.child.forEach(child => {
        data.push({
          ROWGUID: child.ROWGUID,
          ROLE_CODE: detailData.ROLE_CODE,
          MENU_CODE: child.MENU_CODE,
          IS_VIEW: child.IS_VIEW,
          IS_ADD_NEW: child.IS_ADD_NEW,
          IS_MODIFY: child.IS_MODIFY,
          IS_DELETE: child.IS_DELETE
        });
      });
    });
    updatePermission(data)
      .then(res => {
        toast.success(res);
      })
      .catch(err => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (detailData?.ROLE_CODE) {
      getAllPermissionByRoleCode(detailData.ROLE_CODE)
        .then(res => {
          setPermissionData(res.data.metadata);
        })
        .catch(err => {
          toast.error(err.message);
        });
    }
  }, [detailData.ROLE_CODE]);

  return (
    <div>
      <CustomSheet
        open={!!detailData.ROWGUID}
        onOpenChange={onOpenChange}
        title="Phân quyền cho người dùng"
      >
        <div className="mt-4 flex w-fit flex-row justify-center gap-2 self-center rounded-sm border bg-slate-100 px-6 py-1">
          <p className="text-16 text-gray-900">Chức vụ:</p>
          <p className="text-16 font-semibold text-gray-900">{detailData?.ROLE_NAME}</p>
        </div>
        <CustomSheet.Content title="Phân quyền" className="flex flex-col overflow-hidden">
          <Accordion
            type="multiple"
            defaultValue={permissionData?.map(parent => parent.MENU_CODE)}
            className="w-full h-full overflow-auto px-2"
          >
            {permissionData?.map((parent, parentIndex) => {
              if (parent.child?.length === 0) return null;
              return (
                <AccordionItem
                  value={parent.MENU_CODE}
                  className="border-none"
                  key={parent.MENU_CODE}
                >
                  <AccordionTrigger className="justify-normal">
                    <li className="mr-2 text-sm font-bold">{parent.MENU_NAME}</li>
                  </AccordionTrigger>
                  <AccordionContent>
                      <div className="grid grid-cols-6 border-b bg-blue-50 px-2 py-3 text-sm font-medium text-blue-700">
                        <div className="col-span-2">Loại quyền</div>
                        <div className="text-center">Xem</div>
                        <div className="text-center">Thêm</div>
                        <div className="text-center">Sửa</div>
                        <div className="text-center">Xóa</div>
                      </div>
                      {parent.child?.map((child, childIndex) => {
                        let disabled = false;
                        if (child.PARENT_CODE === "user-manager" && child.ROLE_CODE === "admin") {
                          disabled = true;
                        }
                        return (
                          <div key={child.ROWGUID} className="grid grid-cols-6 border-b px-2 py-3">
                            <div className="col-span-2">{child.MENU_NAME}</div>
                            <Checkbox
                              disabled={disabled}
                              className="self-center justify-self-center border-blue-600 data-[state=checked]:bg-blue-600"
                              checked={child.IS_VIEW}
                              onCheckedChange={checked => {
                                let temp = [...permissionData];
                                temp[parentIndex].child[childIndex].IS_VIEW = checked;
                                setPermissionData(temp);
                              }}
                            />
                            <Checkbox
                              disabled={disabled}
                              className="self-center justify-self-center border-blue-600 data-[state=checked]:bg-blue-600"
                              checked={child.IS_ADD_NEW}
                              onCheckedChange={checked => {
                                let temp = [...permissionData];
                                temp[parentIndex].child[childIndex].IS_ADD_NEW = checked;
                                setPermissionData(temp);
                              }}
                            />
                            <Checkbox
                              disabled={disabled}
                              className="self-center justify-self-center border-blue-600 data-[state=checked]:bg-blue-600"
                              checked={child.IS_MODIFY}
                              onCheckedChange={checked => {
                                let temp = [...permissionData];
                                temp[parentIndex].child[childIndex].IS_MODIFY = checked;
                                setPermissionData(temp);
                              }}
                            />
                            <Checkbox
                              disabled={disabled}
                              className="self-center justify-self-center border-blue-600 data-[state=checked]:bg-blue-600"
                              checked={child.IS_DELETE}
                              onCheckedChange={checked => {
                                let temp = [...permissionData];
                                temp[parentIndex].child[childIndex].IS_DELETE = checked;
                                setPermissionData(temp);
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
    </div>
  );
}
