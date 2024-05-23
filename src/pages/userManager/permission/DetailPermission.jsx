import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useCustomToast } from "@/components/custom-toast";
import { X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllPermissionByRoleCode, updatePermission } from "@/apis/permission";
import { useSelector } from "react-redux";

export function DetailPermission({ open, onOpenChange, detailData }) {
  const toast = useCustomToast();
  const [permissionData, setPermissionData] = useState([]);
  const user = useSelector(state => state.userSlice.user);

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
        toast.success(res.data.message);
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
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent hiddenIconClose={true} className="sm:max-w-1/2 w-1/2 p-0  ">
          <span className="flex h-screen flex-col justify-between">
            <span>
              <div className="flex items-center justify-between p-6">
                <div className="text-xl font-bold text-gray-900">Phân quyền cho người dùng</div>
                <X
                  className="size-4 cursor-pointer hover:opacity-80"
                  onClick={() => {
                    onOpenChange();
                  }}
                />
              </div>
              <Separator className="bg-gray-400" />

              <div className="space-y-4 p-6">
                <div className="text-lg font-medium text-gray-900">Chức vụ</div>
                <div className="text-base font-bold text-blue-700">{detailData?.ROLE_NAME}</div>
                <div className="pt-4 text-lg font-medium text-gray-900">Phân quyền</div>
              </div>
            </span>
            <span className="flex-1 overflow-y-auto px-6">
              <Accordion
                type="multiple"
                defaultValue={permissionData?.map(parent => parent.MENU_CODE)}
                className="w-full"
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
                        <span className="grid grid-cols-6 border-b bg-blue-50 px-2 py-3 text-sm font-medium text-blue-700">
                          <div className="col-span-2">Loại quyền</div>
                          <div className="text-center">Xem</div>
                          <div className="text-center">Thêm</div>
                          <div className="text-center">Sửa</div>
                          <div className="text-center">Xóa</div>
                        </span>
                        {parent.child?.map((child, childIndex) => {
                          console.log("🚀 ~ {parent.child?.map ~ child:", parent);
                          let disabled = false;
                          if (child.PARENT_CODE === "user-manager" && child.ROLE_CODE === "admin") {
                            disabled = true;
                          }
                          return (
                            <span
                              key={child.ROWGUID}
                              className="grid grid-cols-6 border-b px-2 py-3"
                            >
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
                            </span>
                          );
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </span>

            <span>
              <Separator className="bg-gray-200" />
              <span className="flex items-center justify-end gap-4 p-6">
                <Button onClick={onOpenChange} className="h-12 w-[126px]" variant="outline">
                  Hủy
                </Button>
                <Button
                  onClick={() => {
                    handlerUpdatePermission();
                  }}
                  className="h-12 w-[126px]"
                  variant="blue"
                >
                  Lưu thông tin
                </Button>
              </span>
            </span>
          </span>
        </SheetContent>
      </Sheet>
    </div>
  );
}
