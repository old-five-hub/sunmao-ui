import { Application } from '@meta-ui/core';

export const DialogFormSchema: Application = {
  version: 'example/v1',
  kind: 'Application',
  metadata: {
    name: 'dialog form',
    description: 'dialog form example',
  },
  spec: {
    components: [
      {
        id: 'fetchVolumes',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/fetch',
            properties: {
              name: 'query',
              url: 'https://61373521eac1410017c18209.mockapi.io/Volume',
              method: 'get',
              lazy: false,
            },
          },
        ],
      },
      {
        id: 'createVolume',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/fetch',
            properties: {
              url: 'https://61373521eac1410017c18209.mockapi.io/Volume',
              method: 'post',
              lazy: true,
              headers: [{ key: 'Content-Type', value: 'application/json' }],
              body: '{{ form.data }}',
              onComplete: [
                {
                  componentId: '$utils',
                  method: {
                    name: 'toast.open',
                    parameters: {
                      id: 'createSuccessToast',
                      title: '恭喜',
                      description: '创建虚拟卷成功',
                      position: 'bottom-right',
                      duration: null,
                      isClosable: true,
                    },
                  },
                },
                {
                  componentId: 'editDialog',
                  method: {
                    name: 'cancelDialog',
                  },
                },
                {
                  componentId: 'form',
                  method: {
                    name: 'resetForm',
                  },
                },
                {
                  componentId: 'fetchVolumes',
                  method: {
                    name: 'triggerFetch',
                    parameters: 'query',
                  },
                  wait: {},
                  disabled: 'false',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'deleteVolume',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/fetch',
            properties: {
              url: 'https://61373521eac1410017c18209.mockapi.io/Volume/{{ table.selectedItem ? table.selectedItem.id : "" }}',
              method: 'delete',
              lazy: true,
              onComplete: [
                {
                  componentId: 'fetchVolumes',
                  method: {
                    name: 'triggerFetch',
                    parameters: 'query',
                  },
                  wait: {},
                  disabled: 'false',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'root',
        type: 'chakra_ui/v1/root',
        properties: {},
        traits: [],
      },
      {
        id: 'editDialog',
        type: 'chakra_ui/v1/dialog',
        properties: {
          title: 'This is a dialog',
          confirmButton: {
            text: '保存',
            colorScheme: 'purple',
          },
          cancelButton: {
            text: '取消',
          },
          disableConfirm: '{{ form.isFormInvalid }}',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'root',
                slot: 'root',
              },
            },
          },
          {
            type: 'core/v1/event',
            properties: {
              events: [
                {
                  event: 'confirmDialog',
                  componentId: 'createVolume',
                  method: {
                    name: 'triggerFetch',
                  },
                  wait: {},
                  disabled: false,
                },
              ],
            },
          },
        ],
      },
      {
        id: 'table',
        type: 'chakra_ui/v1/table',
        properties: {
          data: '{{ fetchVolumes.fetch.data }}',
          majorKey: 'id',
          rowsPerPage: 5,
          columns: [
            {
              key: 'id',
              title: 'ID',
              type: 'text',
            },
            {
              key: 'name',
              title: '名称',
              type: 'text',
            },
            {
              key: 'type',
              title: '类别',
              type: 'text',
              displayValue:
                '{{$listItem.type === "sharing" ? "共享虚拟卷" : "虚拟卷"}}',
            },
            {
              key: 'size',
              title: '容量',
              type: 'text',
              displayValue: '{{$listItem.size}} GiB',
            },
            {
              key: 'policy',
              title: '存储策略',
              type: 'text',
            },
            {
              key: 'isActive',
              title: '是否激活',
              type: 'text',
              displayValue: '{{$listItem.isActive ? "是" : "否"}}',
            },
            {
              key: 'operation',
              title: '操作',
              type: 'button',
              buttonConfig: {
                text: '删除',
                events: [
                  {
                    componentId: 'deleteVolume',
                    method: {
                      name: 'triggerFetch',
                    },
                  },
                ],
              },
            },
            {
              key: 'edit',
              title: '创建',
              type: 'button',
              buttonConfig: {
                text: '创建',
                events: [
                  {
                    componentId: 'editDialog',
                    method: {
                      name: 'openDialog',
                      parameters: {
                        title: '创建虚拟卷',
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'root',
                slot: 'root',
              },
            },
          },
        ],
      },
      {
        id: 'form',
        type: 'chakra_ui/v1/form',
        properties: {
          hideSubmit: true,
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'editDialog',
                slot: 'content',
              },
            },
          },
        ],
      },
      {
        id: 'nameFormControl',
        type: 'chakra_ui/v1/formControl',
        properties: {
          label: '名称',
          fieldName: 'name',
          isRequired: true,
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'form',
                slot: 'content',
              },
            },
          },
        ],
      },
      {
        id: 'nameInput',
        type: 'chakra_ui/v1/input',
        properties: {
          defaultValue:
            '{{ table.selectedItem ? table.selectedItem.name : "" }}',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'nameFormControl',
                slot: 'content',
              },
            },
          },
          {
            type: 'core/v1/validation',
            properties: {
              value: '{{ nameInput.value || "" }}',
              maxLength: 10,
              minLength: 2,
            },
          },
        ],
      },
      {
        id: 'typeFormControl',
        type: 'chakra_ui/v1/formControl',
        properties: {
          label: '类型',
          fieldName: 'type',
          helperText:
            '共享虚拟卷支持被多台虚拟机同时挂载。类型创建后不可修改。',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'form',
                slot: 'content',
              },
            },
          },
        ],
      },
      {
        id: 'typeRadioGroup',
        type: 'chakra_ui/v1/radio_group',
        properties: {
          defaultValue:
            '{{ table.selectedItem ? table.selectedItem.type : "notSharing" }}',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'typeFormControl',
                slot: 'content',
              },
            },
          },
        ],
      },
      {
        id: 'radio1',
        type: 'chakra_ui/v1/radio',
        properties: {
          text: {
            raw: '虚拟卷',
            format: 'plain',
          },
          value: 'notSharing',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'typeRadioGroup',
                slot: 'content',
              },
            },
          },
        ],
      },
      {
        id: 'radio2',
        type: 'chakra_ui/v1/radio',
        properties: {
          text: {
            raw: '共享虚拟卷',
            format: 'plain',
          },
          value: 'sharing',
          size: 'md',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'typeRadioGroup',
                slot: 'content',
              },
            },
          },
        ],
      },
      {
        id: 'sizeFormControl',
        type: 'chakra_ui/v1/formControl',
        properties: {
          label: '容量',
          fieldName: 'size',
          isRequired: true,
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'form',
                slot: 'content',
              },
            },
          },
        ],
      },
      {
        id: 'sizeInput',
        type: 'chakra_ui/v1/number_input',
        properties: {
          defaultValue:
            '{{ table.selectedItem ? table.selectedItem.size : 0 }}',
          min: 0,
          max: 100,
          step: 5,
          precision: 2,
          clampValueOnBlur: false,
          allowMouseWheel: true,
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'sizeFormControl',
                slot: 'content',
              },
            },
          },
        ],
      },
      {
        id: 'policyFormControl',
        type: 'chakra_ui/v1/formControl',
        properties: {
          label: '存储策略',
          fieldName: 'policy',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'form',
                slot: 'content',
              },
            },
          },
        ],
      },
      {
        id: 'policySelect',
        type: 'chakra_ui/v1/select',
        properties: {
          defaultValue:
            '{{ table.selectedItem ? table.selectedItem.policy : "2thin" }}',
          options: [
            {
              value: '2thin',
              label: '2 副本，精简置备',
            },
            {
              value: '3thin',
              label: '3 副本，精简置备',
            },
            {
              value: '2thick',
              label: '2 副本，厚置备',
            },
            {
              value: '3thick',
              label: '3 副本，厚置备',
            },
          ],
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'policyFormControl',
                slot: 'content',
              },
            },
          },
        ],
      },
      {
        id: 'isActiveFormControl',
        type: 'chakra_ui/v1/formControl',
        properties: {
          label: '激活',
          fieldName: 'isActive',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'form',
                slot: 'content',
              },
            },
          },
        ],
      },
      {
        id: 'checkbox',
        type: 'chakra_ui/v1/checkbox',
        properties: {
          value: 'isActive',
          defaultIsChecked:
            '{{table.selectedItem ? !!table.selectedItem.isActive : false}}',
          text: {
            raw: '激活',
            format: 'plain',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'isActiveFormControl',
                slot: 'content',
              },
            },
          },
        ],
      },
    ],
  },
};
