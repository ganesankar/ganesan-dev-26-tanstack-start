import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type VisibilityState,
} from '@tanstack/react-table'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TablePagination from '@mui/material/TablePagination'
import TableSortLabel from '@mui/material/TableSortLabel'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'

interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  searchPlaceholder?: string
  onDelete?: (ids: string[]) => Promise<void>
  onPublish?: (ids: string[], publish: boolean) => Promise<void>
}

export function DataTable<T>({
  columns,
  data,
  searchPlaceholder = 'Search…',
  onDelete,
  onPublish,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [isLoading, setIsLoading] = useState(false)
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, rowSelection, columnVisibility },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          size="small"
          placeholder={searchPlaceholder}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          sx={{ minWidth: 280, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<ViewColumnIcon fontSize="small" />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ color: 'text.secondary', borderColor: 'divider' }}
        >
          View
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          slotProps={{ paper: { sx: { minWidth: 150 } } }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="overline" color="text.secondary">Toggle Columns</Typography>
          </Box>
          {table
            .getAllColumns()
            .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
            .map((column) => {
              return (
                <MenuItem
                  key={column.id}
                  onClick={() => column.toggleVisibility()}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={column.getIsVisible()}
                      size="small"
                      disableRipple
                      sx={{ p: 0 }}
                    />
                  </ListItemIcon>
                  <ListItemText sx={{ textTransform: 'capitalize' }}>
                    {column.id.replace(/_/g, ' ')}
                  </ListItemText>
                </MenuItem>
              )
            })}
        </Menu>
      </Box>

      {/* Bulk Actions */}
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {table.getFilteredSelectedRowModel().rows.length} selected
          </Typography>
          {onPublish && (
            <>
              <Button
                variant="outlined"
                size="small"
                disabled={isLoading}
                startIcon={<VisibilityIcon fontSize="small" />}
                onClick={async () => {
                  setIsLoading(true)
                  const ids = table.getFilteredSelectedRowModel().rows.map((r) => (r.original as any).id)
                  await onPublish(ids, true).catch(console.error)
                  setRowSelection({})
                  setIsLoading(false)
                }}
              >
                Publish
              </Button>
              <Button
                variant="outlined"
                size="small"
                disabled={isLoading}
                startIcon={<VisibilityOffIcon fontSize="small" />}
                onClick={async () => {
                  setIsLoading(true)
                  const ids = table.getFilteredSelectedRowModel().rows.map((r) => (r.original as any).id)
                  await onPublish(ids, false).catch(console.error)
                  setRowSelection({})
                  setIsLoading(false)
                }}
              >
                Unpublish
              </Button>
            </>
          )}
          {onDelete && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              disabled={isLoading}
              startIcon={<DeleteIcon fontSize="small" />}
              onClick={async () => {
                if (!confirm('Are you sure you want to delete the selected items?')) return
                setIsLoading(true)
                const ids = table.getFilteredSelectedRowModel().rows.map((r) => (r.original as any).id)
                await onDelete(ids).catch(console.error)
                setRowSelection({})
                setIsLoading(false)
              }}
            >
              Delete
            </Button>
          )}
        </Box>
      )}

      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 600 }}>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sortDirection={header.column.getIsSorted() || false}
                    sx={{ 
                      fontWeight: 500, 
                      color: 'text.secondary',
                      whiteSpace: 'nowrap',
                      py: 1,
                      px: 2,
                      borderBottom: 1,
                      borderColor: 'divider',
                      fontSize: '0.8125rem'
                    }}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <TableSortLabel
                        active={!!header.column.getIsSorted()}
                        direction={
                          header.column.getIsSorted() === 'desc' ? 'desc' : 'asc'
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </TableSortLabel>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow 
                  key={row.id} 
                  hover 
                  sx={{ 
                    transition: 'colors 0.2s',
                    '&:last-child td, &:last-child th': { border: 0 } 
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} sx={{ py: 1, px: 2, borderColor: 'divider', fontSize: '0.875rem' }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>

      <TablePagination
        component="div"
        count={table.getFilteredRowModel().rows.length}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
        rowsPerPage={table.getState().pagination.pageSize}
        onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Box>
  )
}
